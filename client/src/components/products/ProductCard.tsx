import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProductWithDetails } from "@shared/schema";
import { useAddToCart, useAddToWatchlist } from "@/lib/api";
import { useUser } from "@/lib/auth";

interface ProductCardProps {
  product: ProductWithDetails;
  onQuickView: (product: ProductWithDetails) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { data: user } = useUser();
  const addToCart = useAddToCart();
  const addToWatchlist = useAddToWatchlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    // If product has variants, open quick view modal instead
    if (product.variants && product.variants.length > 0) {
      onQuickView(product);
      return;
    }

    // For products without variants, add directly to cart
    addToCart.mutate(
      { 
        productId: product.id, 
        quantity: 1,
        variantInfo: null  // Explicitly set to null for products without variants
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`
          });
        },
        onError: (error) => {
          console.error("Add to cart error:", error);
          toast({
            title: "Error",
            description: "Failed to add item to cart. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div 
      className="group relative rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium truncate">{product.name}</h3>
          <p className="text-primary font-bold mt-1">₹{product.price.toFixed(2)}</p>
          
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-amber-600 text-sm mt-1">Low Stock</p>
          )}
          
          {product.stock === 0 && (
            <p className="text-red-600 text-sm mt-1">Out of Stock</p>
          )}
        </div>
        
        {/* Hover options */}
        <div 
          className={`absolute top-0 left-0 w-full h-full bg-black/5 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex gap-2 bg-white p-2 rounded-full shadow-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100" 
              onClick={handleAddToWatchlist}
              title="Add to Watchlist"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              title="Add to Cart"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100" 
              onClick={handleQuickView}
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
