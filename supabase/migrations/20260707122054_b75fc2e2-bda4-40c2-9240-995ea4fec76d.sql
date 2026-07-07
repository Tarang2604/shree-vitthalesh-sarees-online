-- 1. Tighten the always-true INSERT policy on contact_submissions
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;

CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) > 0 AND char_length(name) <= 100
  AND char_length(phone) > 0 AND char_length(phone) <= 20
  AND char_length(message) > 0 AND char_length(message) <= 2000
  AND (email IS NULL OR char_length(email) <= 255)
);

-- 2. Lock down SECURITY DEFINER trigger-only functions (no direct API execution)
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 3. Restrict has_role to signed-in users only (needed for RLS evaluation), remove broad/anon access
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 4. Restrict create_order to the roles that actually place orders (shoppers + guests), remove broad PUBLIC grant
REVOKE EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, jsonb, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, jsonb, text, text) TO anon, authenticated;
