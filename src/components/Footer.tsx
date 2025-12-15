import { Instagram, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-6">
              <span className="font-display text-2xl font-bold text-primary-foreground">
                Shree Vitthalesh
              </span>
              <span className="font-display text-sm text-accent block tracking-widest uppercase">
                Sarees
              </span>
            </div>
            <p className="font-body text-primary-foreground/70 text-sm leading-relaxed">
              Celebrating the timeless elegance of Indian sarees. Your destination for authentic handwoven masterpieces.
            </p>
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
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5" />
                <span className="font-body text-sm">+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5" />
                <span className="font-body text-sm">Maharashtra, India</span>
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
