import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  email: z.string().trim().email("Valid email required").optional().or(z.literal("")),
  address: z.string().trim().min(10, "Complete address required").max(500),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(100),
  pincode: z.string().trim().min(6, "Valid pincode required").max(10),
  notes: z.string().max(500).optional(),
});

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "Madhya Pradesh",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          shipping_address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          total_amount: totalAmount,
          notes: formData.notes || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "We will contact you shortly to confirm your order.",
      });
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !showCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="font-body text-muted-foreground mb-8">
              Add some beautiful sarees to your cart
            </p>
            <Button variant="gold" onClick={() => navigate("/shop")}>
              Browse Collection
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
            {showCheckout ? "Checkout" : "Shopping Cart"}
          </h1>

          {!showCheckout ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl p-4 flex gap-4 shadow-sm"
                  >
                    <div className="w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-maroon">
                          <span className="font-display text-2xl text-primary-foreground/30">
                            {item.name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <p className="font-display text-primary font-bold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-body font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 shadow-elegant sticky top-24">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between font-body">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-accent">Free</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between font-display text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(totalAmount)}</span>
                    </div>
                  </div>
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                  <p className="font-body text-xs text-muted-foreground mt-4 text-center">
                    🚫 No COD • 📦 Shipping Across India
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="bg-card rounded-xl p-6 shadow-sm space-y-4">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Shipping Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House/Flat No., Street, Locality"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                      {errors.state && (
                        <p className="text-sm text-destructive">{errors.state}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="000000"
                      />
                      {errors.pincode && (
                        <p className="text-sm text-destructive">{errors.pincode}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-card rounded-xl p-6 shadow-sm">
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between font-body text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <hr className="border-border mb-4" />
                  <div className="flex justify-between font-display text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCheckout(false)}
                  >
                    Back to Cart
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </Button>
                </div>

                <p className="font-body text-sm text-muted-foreground text-center">
                  We will call you to confirm your order and share payment details.
                </p>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
