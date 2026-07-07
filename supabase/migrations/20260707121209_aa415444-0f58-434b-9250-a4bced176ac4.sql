-- =====================================================================
-- 1. Harden has_role(): keep SECURITY DEFINER (needed to avoid RLS
--    recursion on user_roles) but restrict it to ONLY report roles for
--    the currently authenticated user. All RLS policies call
--    has_role(auth.uid(), ...), so this preserves behaviour while
--    removing any ability to probe other users' roles.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow checking the currently authenticated user's roles.
  IF _user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;

-- =====================================================================
-- 2. Tighten orders INSERT policy: an authenticated user may only
--    create orders owned by themselves (no null user_id smuggling).
--    Guest (unauthenticated) checkout is still allowed with user_id NULL.
-- =====================================================================
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
  OR (auth.uid() IS NULL AND user_id IS NULL)
);

-- =====================================================================
-- 3. Tighten order_items INSERT policy: the referenced order must be
--    owned by the caller (or be a guest order for guest sessions),
--    replacing the previous permissive WITH CHECK (true).
-- =====================================================================
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;
CREATE POLICY "Users can create order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
        OR (auth.uid() IS NULL AND o.user_id IS NULL)
      )
  )
);

-- =====================================================================
-- 4. Atomic, price-safe order creation.
--    * Prices and product names come from the products table, never the
--      client -> prevents cart price manipulation.
--    * Order + order_items are inserted in a single function/transaction
--      -> removes the non-atomic race condition.
--    * user_id is derived from auth.uid() -> orders are always correctly
--      attributed.
-- =====================================================================
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_shipping_address text,
  p_city text,
  p_state text,
  p_pincode text,
  p_items jsonb,
  p_customer_email text DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order_id uuid;
  v_total numeric := 0;
  v_item_count int;
  v_matched_count int;
BEGIN
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  -- Reject non-positive quantities.
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_items) item
    WHERE COALESCE((item->>'quantity')::int, 0) <= 0
  ) THEN
    RAISE EXCEPTION 'Invalid quantity';
  END IF;

  -- Ensure every requested product exists and is in stock.
  SELECT jsonb_array_length(p_items) INTO v_item_count;
  SELECT COUNT(*) INTO v_matched_count
  FROM jsonb_array_elements(p_items) item
  JOIN public.products p ON p.id = (item->>'product_id')::uuid
  WHERE p.in_stock = true;

  IF v_matched_count <> v_item_count THEN
    RAISE EXCEPTION 'One or more products are invalid or unavailable';
  END IF;

  -- Compute the authoritative total from server-side prices.
  SELECT COALESCE(SUM(p.price * (item->>'quantity')::int), 0)
  INTO v_total
  FROM jsonb_array_elements(p_items) item
  JOIN public.products p ON p.id = (item->>'product_id')::uuid;

  INSERT INTO public.orders (
    user_id, customer_name, customer_phone, customer_email,
    shipping_address, city, state, pincode, total_amount, notes
  ) VALUES (
    auth.uid(), p_customer_name, p_customer_phone, p_customer_email,
    p_shipping_address, p_city, p_state, p_pincode, v_total, p_notes
  ) RETURNING id INTO v_order_id;

  INSERT INTO public.order_items (order_id, product_id, product_name, quantity, price)
  SELECT v_order_id, p.id, p.name, (item->>'quantity')::int, p.price
  FROM jsonb_array_elements(p_items) item
  JOIN public.products p ON p.id = (item->>'product_id')::uuid;

  RETURN v_order_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, jsonb, text, text) TO anon, authenticated;