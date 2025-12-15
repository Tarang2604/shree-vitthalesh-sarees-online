import { Instagram, Phone, MapPin, Heart, Video, Truck } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <img 
                src={logo} 
                alt="Shree Vitthalesh Sarees Logo" 
                className="h-14 w-auto"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-primary-foreground leading-tight">
                  Shree Vitthalesh
                </span>
                <span className="font-display text-xs text-accent tracking-widest uppercase">
                  Sarees
                </span>
              </div>
            </div>
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed mb-4">
              Celebrating the timeless elegance of Indian sarees since 2003. Your destination for authentic handwoven masterpieces.
            </p>
            <div className="flex items-center gap-2 text-accent text-sm font-body">
              <span className="font-semibold">✨ Trusted Since 2003</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-6">
              Quick Links
            </h4>
            <nav className="space-y-3">
              {["Home", "Collections", "About Us", "Contact"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "")}`}
                  className="block font-body text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-6">
              Our Services
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Video className="w-4 h-4 text-accent" />
                <span className="font-body text-sm">Video Call Shopping</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Truck className="w-4 h-4 text-accent" />
                <span className="font-body text-sm">Shipping Across India</span>
              </div>
              <p className="font-body text-sm text-primary-foreground/50">
                * No COD Available
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-6">
              Connect With Us
            </h4>
            <div className="space-y-4">
              <a
                href="https://www.instagram.com/shree.vitthalesh.sarees/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="font-body text-sm">@shree.vitthalesh.sarees</span>
              </a>
              <a
                href="tel:+918349985566"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-body text-sm">+91 8349985566</span>
              </a>
              <div className="flex items-start gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <span className="font-body text-sm">
                  118, Tambaku Bazar<br />
                  Near Ghantaghar Sq.<br />
                  Jaora, Madhya Pradesh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-primary-foreground/50">
              © {currentYear} Shree Vitthalesh Sarees. All rights reserved.
            </p>
            <p className="font-body text-sm text-primary-foreground/50 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
