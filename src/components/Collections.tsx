import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import saree1 from "@/assets/saree-1.jpg";
import saree2 from "@/assets/saree-2.jpg";
import saree3 from "@/assets/saree-3.jpg";
import saree4 from "@/assets/saree-4.jpg";

const collections = [
  {
    id: 1,
    name: "Banarasi Silk",
    description: "Luxurious silk with intricate zari work",
    image: saree1,
    category: "Wedding",
    price: "₹15,000 - ₹50,000",
  },
  {
    id: 2,
    name: "Bridal Red",
    description: "Traditional red with golden embroidery",
    image: saree2,
    category: "Bridal",
    price: "₹25,000 - ₹1,00,000",
  },
  {
    id: 3,
    name: "Kanjeevaram",
    description: "South Indian temple border sarees",
    image: saree3,
    category: "Traditional",
    price: "₹20,000 - ₹75,000",
  },
  {
    id: 4,
    name: "Paithani",
    description: "Maharashtrian peacock motif sarees",
    image: saree4,
    category: "Heritage",
    price: "₹30,000 - ₹1,50,000",
  },
];

const categories = ["All", "Wedding", "Bridal", "Traditional", "Heritage"];

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredCollections =
    activeCategory === "All"
      ? collections
      : collections.filter((c) => c.category === activeCategory);

  return (
    <section id="collections" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-body text-sm font-medium text-accent tracking-widest uppercase mb-4 block">
            Our Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Handpicked <span className="text-primary">Masterpieces</span>
          </h2>
          <p className="font-body text-muted-foreground">
            Each saree in our collection is carefully curated to bring you the finest examples of Indian textile artistry.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`font-body text-sm px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCollections.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-card rounded-xl overflow-hidden shadow-elegant opacity-0 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="font-body text-xs font-medium bg-accent/90 text-accent-foreground px-3 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-body text-sm text-primary-foreground/80 mb-4">
                    {item.description}
                  </p>
                  <Button variant="gold" size="sm" className="w-full">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {item.name}
                </h3>
                <p className="font-body text-sm text-accent font-medium">
                  {item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Collections
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Collections;
