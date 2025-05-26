import { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useWatchlist, useRemoveFromWatchlist, useAddToCart, useProduct } from "@/lib/api";
import { Heart, ShoppingBag, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import QuickViewModal from "@/components/products/QuickViewModal";
import { ProductWithDetails } from "@shared/schema";

const Watchlist = () => {
  const { data: watchlistItems = [], isLoading } = useWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const addToCart = useAddToCart();
  const { toast } = useToast();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const { data: productDetails } = useProduct(selectedProductId || 0);

  const handleRemoveFromWatchlist = (id: number, name: string) => {
    removeFromWatchlist.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Removed from watchlist",
          description: `${name} has been removed from your watchlist.`
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to remove item from watchlist. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const handleAddToCart = (productId: number, name: string) => {
    addToCart.mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${name} has been added to your cart.`
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add item to cart. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleQuickView = (productId: number) => {
    setSelectedProductId(productId);
  };

  const closeQuickView = () => {
    setSelectedProductId(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-lg">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  if (watchlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Watchlist - Fourkids Wholesale</title>
          <meta name="description" content="View and manage items in your wholesale watchlist." />
        </Helmet>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Heart className="h-16 w-16 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Watchlist is Empty</h1>
            <p className="text-gray-600 mb-8">
              Save items you like to your watchlist so you can find them again later.
            </p>
            <Button size="lg" asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Watchlist - Fourkids Wholesale</title>
        <meta name="description" content="View and manage items in your wholesale watchlist." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Watchlist</h1>
          <Button asChild>
            <Link href="/cart">
              View Cart <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {watchlistItems.map(item => (
            <Card key={item.id} className="group relative overflow-hidden">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white"
                  onClick={() => handleRemoveFromWatchlist(item.id, item.product.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <Link href={`/product/${item.product.id}`}>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
              
              <CardContent className="p-4">
                <Link href={`/product/${item.product.id}`}>
                  <h3 className="font-medium truncate hover:text-primary">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-primary font-bold mt-1">₹{item.product.price.toFixed(2)}</p>
                
                {item.product.stock <= 5 && item.product.stock > 0 && (
                  <p className="text-amber-600 text-sm mt-1">Low Stock</p>
                )}
                
                {item.product.stock === 0 && (
                  <p className="text-red-600 text-sm mt-1">Out of Stock</p>
                )}
              </CardContent>
              
              <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleQuickView(item.product.id)}
                >
                  Quick View
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full"
                  onClick={() => handleAddToCart(item.product.id, item.product.name)}
                  disabled={item.product.stock === 0}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {selectedProductId && productDetails && (
        <QuickViewModal
          product={productDetails}
          isOpen={!!selectedProductId}
          onClose={closeQuickView}
        />
      )}
    </>
  );
};

export default Watchlist;
