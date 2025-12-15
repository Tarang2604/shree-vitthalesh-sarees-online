import { CheckCircle, Award, Users, Gem } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest silk and fabrics sourced from trusted artisans across India",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Our team helps you find the perfect saree for every occasion",
  },
  {
    icon: Gem,
    title: "Authentic Designs",
    description: "Each piece is a genuine work of art with authentic traditional patterns",
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/50 -skew-x-12 transform origin-top-right" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="opacity-0 animate-fade-in-left" style={{ animationDelay: "0.2s" }}>
            <span className="font-body text-sm font-medium text-accent tracking-widest uppercase mb-4 block">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              A Legacy of{" "}
              <span className="text-primary">Tradition</span> & Trust
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-8">
              Shree Vitthalesh Sarees has been a trusted name in traditional Indian
              sarees for over 15 years. Our showroom brings together the finest
              handwoven sarees from master craftsmen across India – from the
              luxurious Banarasi silks of Varanasi to the intricate Kanjeevaram
              weaves of Tamil Nadu.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Every saree in our collection is a testament to India's rich textile
              heritage, carefully selected to ensure authenticity, quality, and
              timeless beauty.
            </p>

            {/* Checklist */}
            <div className="space-y-4">
              {[
                "Handpicked collection from master weavers",
                "Authentic traditional and contemporary designs",
                "Personalized styling assistance",
                "Quality assurance guarantee",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="font-body text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="space-y-6 opacity-0 animate-fade-in-right" style={{ animationDelay: "0.4s" }}>
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card p-6 rounded-xl shadow-elegant hover:shadow-gold transition-shadow duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-body text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
