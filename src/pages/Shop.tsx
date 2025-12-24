import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Filter, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  fabric: string | null;
  color: string | null;
  image_url: string | null;
  in_stock: boolean | null;
  featured: boolean | null;
}

const Shop = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  const categories = products
    ? Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    : [];

  const filteredProducts = products?.filter(
    (p) => categoryFilter === "all" || p.category === categoryFilter
  );

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-body text-sm font-medium text-accent tracking-widest uppercase mb-4 block">
              Our Collection
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Exquisite <span className="text-gradient-gold">Sarees</span>
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Browse our curated collection of handpicked sarees from across India
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 font-body">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="font-body text-sm text-muted-foreground">
              {filteredProducts?.length || 0} products
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-[3/4] bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-5 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-gold transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-maroon">
                        <span className="font-display text-4xl text-primary-foreground/30">
                          {product.name[0]}
                        </span>
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-body font-medium px-3 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                    >
                      <Heart className="w-4 h-4 text-primary" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-2">
                      {product.fabric} • {product.color}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      <Button
                        size="sm"
                        variant="gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-maroon">
                    <span className="font-display text-6xl text-primary-foreground/30">
                      {selectedProduct.name[0]}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <span className="font-display text-3xl font-bold text-primary">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>
                <p className="font-body text-muted-foreground">
                  {selectedProduct.description || "A beautiful handcrafted saree from our exclusive collection."}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-muted-foreground">Category:</span>
                    <span className="font-body text-sm font-medium">{selectedProduct.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-muted-foreground">Fabric:</span>
                    <span className="font-body text-sm font-medium">{selectedProduct.fabric}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-muted-foreground">Color:</span>
                    <span className="font-body text-sm font-medium">{selectedProduct.color}</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <Button
                    variant="gold"
                    className="flex-1"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                <p className="font-body text-sm text-muted-foreground">
                  📞 For video call shopping, call us at +91 8349985566
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Shop;
