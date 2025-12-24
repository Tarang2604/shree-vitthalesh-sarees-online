import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Clock, Instagram, MessageCircle, Video, Truck, Ban, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Showroom",
    details: ["118, Tambaku Bazar", "Near Ghantaghar Sq.", "Jaora, Madhya Pradesh"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 8349985566", "Video Call Available"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: 11:00 AM - 6:00 PM"],
  },
];

const highlights = [
  { icon: Video, label: "Video Call Shopping" },
  { icon: Truck, label: "Shipping Across India" },
  { icon: Ban, label: "No COD Available" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(10, "Valid phone number required").max(15),
  email: z.string().trim().email("Valid email required").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(formData);
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
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We will get back to you soon.",
      });
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try calling us directly at +91 8349985566",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-maroon relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-body text-sm font-medium text-accent tracking-widest uppercase mb-4 block">
            Get in Touch
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Visit Our <span className="text-gradient-gold">Showroom</span>
          </h2>
          <p className="font-body text-primary-foreground/80">
            Experience the elegance of our saree collection in person. Our expert team is ready to help you find your perfect saree.
          </p>
        </div>

        {/* Service Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {highlights.map((item, index) => (
            <div
              key={item.label}
              className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-5 py-2"
            >
              <item.icon className="w-4 h-4 text-accent" />
              <span className="font-body text-sm text-primary-foreground/90">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={info.title}
              className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-6 text-center opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                {info.title}
              </h3>
              <div className="space-y-1">
                {info.details.map((detail, i) => (
                  <p key={i} className="font-body text-primary-foreground/80 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-card/10 backdrop-blur-sm border border-primary-foreground/20 rounded-xl p-6">
            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-6 text-center">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-primary-foreground/90">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    className="bg-card/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  {errors.name && (
                    <p className="text-sm text-accent">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary-foreground/90">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXXXXXXX"
                    className="bg-card/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  {errors.phone && (
                    <p className="text-sm text-accent">{errors.phone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary-foreground/90">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="bg-card/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
                {errors.email && (
                  <p className="text-sm text-accent">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-primary-foreground/90">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="What would you like to know?"
                  rows={4}
                  className="bg-card/20 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
                />
                {errors.message && (
                  <p className="text-sm text-accent">{errors.message}</p>
                )}
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={loading}>
                <Send className="w-4 h-4 mr-2" />
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="tel:+918349985566">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              <Phone className="w-5 h-5" />
              Call Now
            </Button>
          </a>
          <a
            href="https://www.instagram.com/shree.vitthalesh.sarees/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
              <Instagram className="w-5 h-5" />
              Follow on Instagram
            </Button>
          </a>
          <a href="https://wa.me/918349985566" target="_blank" rel="noopener noreferrer">
            <Button variant="heroOutline" size="lg" className="w-full sm:w-auto">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </Button>
          </a>
        </div>

        {/* Instagram Preview */}
        <div className="mt-16 text-center">
          <p className="font-body text-primary-foreground/70 mb-4">
            Follow us on Instagram for the latest collections and offers
          </p>
          <a
            href="https://www.instagram.com/shree.vitthalesh.sarees/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span className="font-body font-medium">@shree.vitthalesh.sarees</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
