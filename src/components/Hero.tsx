import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-saree.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant traditional silk saree with golden embroidery"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-accent/30 rounded-full animate-float opacity-50" />
      <div className="absolute bottom-40 left-20 w-20 h-20 border border-accent/20 rounded-full animate-float" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-body text-primary-foreground/90">
              Celebrating Indian Tradition
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Weaving
            <span className="block text-gradient-gold">Timeless</span>
            Elegance
          </h1>

          {/* Subtitle */}
          <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Discover our exquisite collection of handcrafted sarees, where every thread tells a story of tradition, artistry, and grace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Button variant="hero" size="xl">
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Visit Showroom
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-primary-foreground/20 opacity-0 animate-fade-in" style={{ animationDelay: "0.8s" }}>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">500+</p>
              <p className="font-body text-sm text-primary-foreground/70">Saree Designs</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">15+</p>
              <p className="font-body text-sm text-primary-foreground/70">Years of Trust</p>
            </div>
            <div>
              <p className="font-display text-3xl md:text-4xl font-bold text-accent">10K+</p>
              <p className="font-body text-sm text-primary-foreground/70">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <span className="font-body text-xs text-primary-foreground/60 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
