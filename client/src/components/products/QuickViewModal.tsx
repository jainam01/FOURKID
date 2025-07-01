// File: client/src/components/QuickViewModal.tsx

import { useState, useEffect } from "react";
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

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, product.stock));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));
  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % product.images.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);

  const handleVariantChange = (name: string, value: string) => {
    setSelectedVariants(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to add items to your cart.", variant: "destructive" });
      return;
    }

    const variantInfo = Object.keys(selectedVariants).length > 0
      ? Object.entries(selectedVariants).map(([name, value]) => ({ name, value }))
      : undefined;

    addToCart.mutate(
      { productId: product.id, quantity, variantInfo },
      {
        onSuccess: () => {
          toast({
            className: 'bg-gray-800 text-white border-none font-sans',
            duration: 3000,
            description: (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-sm overflow-hidden flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold">Added to bag</span>
              </div>
            )
          });
          onClose();
        },
        onError: (error) => {
          toast({ title: "Error", description: "Failed to add item to cart.", variant: "destructive" });
        }
      }
    );
  };

  const handleAddToWatchlist = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to add items to your watchlist.", variant: "destructive" });
      return;
    }

    addToWatchlist.mutate(
      { productId: product.id },
      {
        onSuccess: () => {
          toast({
            className: 'bg-gray-800 text-white border-none font-sans',
            duration: 3000,
            description: (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-sm overflow-hidden flex-shrink-0">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="font-bold">Added to wishlist</span>
              </div>
            )
          });
        },
        onError: (error: any) => {
          if (error?.response?.status === 409 || error?.message?.includes("already in watchlist")) {
            toast({ title: "Already in Watchlist", description: "This product is already in your watchlist.", variant: "destructive" });
          } else {
            toast({ title: "Error", description: "Failed to add item to watchlist.", variant: "destructive" });
          }
        }
      }
    );
  };

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCurrentImageIndex(0);
      
      const initialVariants: Record<string, string> = {};
      Object.entries(variantGroups).forEach(([name, values]) => {
        if (values.length > 0) {
          initialVariants[name] = values[0];
        }
      });
      setSelectedVariants(initialVariants);
    }
  }, [isOpen, product]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          <div className="relative aspect-square bg-gray-100">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain" // <-- THE IMAGE SIZING FIX
            />
            {product.images.length > 1 && (
              <>
                <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white" onClick={prevImage}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white" onClick={nextImage}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button key={index} className={`w-2 h-2 rounded-full transition-colors ${ index === currentImageIndex ? 'bg-primary' : 'bg-gray-400 hover:bg-gray-500' }`} onClick={() => setCurrentImageIndex(index)} />
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <DialogTitle className="text-xl font-bold mb-2">
              {product.name}
            </DialogTitle>
            
            <p className="text-2xl font-bold text-primary mb-4">
              ₹{product.price.toFixed(2)}
            </p>
            
            {product.description && (
              <p className="text-gray-700 text-sm line-clamp-3 mb-6">
                {product.description}
              </p>
            )}

            <div className="flex-grow space-y-4">
              {Object.entries(variantGroups).map(([name, values]) => (
                <div key={name}>
                  <p className="text-sm font-medium mb-1">{name}:</p>
                  <Select value={selectedVariants[name] || ""} onValueChange={(value) => handleVariantChange(name, value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`Select ${name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {values.map((value) => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            
            <div className="flex items-center my-6">
              <p className="text-sm font-medium mr-4">Quantity:</p>
              <div className="flex items-center border rounded">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={decrementQuantity} disabled={quantity <= 1}>-</Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={incrementQuantity} disabled={quantity >= product.stock}>+</Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button className="w-full bg-pink-500 hover:bg-pink-600" onClick={handleAddToCart} disabled={product.stock === 0}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" onClick={handleAddToWatchlist}>
                <Heart className="mr-2 h-4 w-4" />
                Add to Watchlist
              </Button>
              <Button variant="link" className="w-full" asChild>
                <Link href={`/product/${product.id}`} onClick={onClose}>
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