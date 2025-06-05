import { useState } from "react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductWithDetails, ProductVariant } from "@shared/schema";
import { useAddToCart, useAddToWatchlist } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuickViewModalProps {
  product: ProductWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: QuickViewModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const { data: user } = useUser();
  const addToCart = useAddToCart();
  const addToWatchlist = useAddToWatchlist();

  // Group variants by name (e.g., Size, Color)
  const variantGroups = product.variants 
    ? product.variants.reduce<Record<string, string[]>>((acc, variant) => {
        if (!acc[variant.name]) {
          acc[variant.name] = [];
        }
        if (!acc[variant.name].includes(variant.value)) {
          acc[variant.name].push(variant.value);
        }
        return acc;
      }, {})
    : {};

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, product.stock));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev + 1 >= product.images.length ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev - 1 < 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    // Convert selected variants to array format
    const variantInfo = Object.entries(selectedVariants).length > 0
      ? Object.entries(selectedVariants).map(([name, value]) => ({ name, value }))
      : null;

    console.log("Adding to cart with variantInfo:", variantInfo); // Debug log

    addToCart.mutate(
      {
        productId: product.id,
        quantity,
        variantInfo
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`
          });
          onClose();
        },
        onError: (error) => {
          console.error("Add to cart error:", error); // Debug log
          toast({
            title: "Error",
            description: "Failed to add item to cart. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleAddToWatchlist = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your watchlist.",
        variant: "destructive"
      });
      return;
    }

    addToWatchlist.mutate(
      { productId: product.id },
      {
        onSuccess: () => {
          toast({
            title: "Added to watchlist",
            description: `${product.name} has been added to your watchlist.`
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add item to watchlist. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="relative aspect-square">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* Image thumbnails */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <DialogTitle className="text-xl font-bold mb-2">
              {product.name}
            </DialogTitle>
            
            <p className="text-2xl font-bold text-primary mb-4">
              ₹{product.price.toFixed(2)}
            </p>
            
            <p className="text-gray-600 mb-6 text-sm">
              SKU: {product.sku}
            </p>
            
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Availability:</p>
              {product.stock > 5 ? (
                <p className="text-green-600">In Stock</p>
              ) : product.stock > 0 ? (
                <p className="text-amber-600">Low Stock (Only {product.stock} left)</p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
            </div>
            
            {/* Product description - truncated for quick view */}
            {product.description && (
              <div className="mb-6">
                <p className="text-gray-700 text-sm line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}
            
            {/* Variant Selectors */}
            {Object.entries(variantGroups).length > 0 && (
              <div className="space-y-4 mb-6">
                {Object.entries(variantGroups).map(([name, values]) => (
                  <div key={name}>
                    <p className="text-sm font-medium mb-1">{name}:</p>
                    <Select
                      value={selectedVariants[name] || ""}
                      onValueChange={(value) => handleVariantChange(name, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {values.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <p className="text-sm font-medium mr-4">Quantity:</p>
              <div className="flex items-center border rounded">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              <Button 
                className="w-full" 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleAddToWatchlist}
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to Watchlist
              </Button>
              
              <Button 
                variant="link" 
                className="w-full" 
                asChild
              >
                <Link href={`/product/${product.id}`}>
                  View Full Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickViewModal;
