import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/lib/api";
import { useAddToCart, useAddToWatchlist } from "@/lib/api"; // These hooks should now use corrected types
import { useUser } from "@/lib/auth";
import { ProductVariant } from "@shared/schema";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Truck, Shield, Box } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import ProductGrid from "@/components/products/ProductGrid";
import { useProducts } from "@/lib/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const [, navigate] = useLocation();
  const { data: product, isLoading, error } = useProduct(productId, { enabled: !!productId });
  const { data: allProducts = [] } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const { data: user } = useUser();
  const addToCart = useAddToCart();
  const addToWatchlist = useAddToWatchlist();

  useEffect(() => {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      setCurrentImageIndex(0);
    } else if (product && (!Array.isArray(product.images) || product.images.length === 0)) {
      setCurrentImageIndex(0); // Or handle as no image, perhaps -1
    }
  }, [product]);

  const variantGroups = product?.variants 
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
    if (product && typeof product.stock === 'number') {
      setQuantity(prev => Math.min(prev + 1, product.stock));
    }
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const safeImages = Array.isArray(product?.images) ? product.images : [];

  const nextImage = () => {
    if (safeImages.length > 0) {
      setCurrentImageIndex(prev => 
        prev + 1 >= safeImages.length ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (safeImages.length > 0) {
      setCurrentImageIndex(prev => 
        prev - 1 < 0 ? safeImages.length - 1 : prev - 1
      );
    }
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
      navigate("/login");
      return;
    }

    if (!product || typeof product.stock !== 'number' || product.stock === 0) {
        toast({ title: "Unavailable", description: "This product is out of stock.", variant: "destructive" });
        return;
    }
    
    const variantInfoForApi: ProductVariant[] = Object.entries(selectedVariants).map(
      ([name, value]) => ({ name, value })
    );

    // This will now be type-correct IF you've fixed the AddToCartMutationVariables type
    addToCart.mutate(
      {
        productId,
        quantity,
        variantInfo: variantInfoForApi.length > 0 ? variantInfoForApi : undefined
      },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product?.name} has been added to your cart.`
          });
        },
        onError: (err) => {
          console.error("Add to cart error:", err);
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
      toast({ title: "Login Required", description: "Please log in to add items to your watchlist.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!product) return;

    addToWatchlist.mutate(
      { productId },
      {
        onSuccess: () => {
          toast({ title: "Added to watchlist", description: `${product?.name} has been added to your watchlist.` });
        },
        onError: (err) => {
          console.error("Add to watchlist error:", err);
          toast({ title: "Error", description: "Failed to add item to watchlist. Please try again.", variant: "destructive" });
        }
      }
    );
  };

  const relatedProducts = allProducts
    .filter(p => product && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[300px]">
        <p className="text-lg">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[300px]">
        <p className="text-lg text-red-500 mb-4">
          {error ? `Error: ${error.message}` : "Product not found."}
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Fourkids Wholesale`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} at wholesale prices from Fourkids.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden border rounded-lg">
              {safeImages.length > 0 && currentImageIndex < safeImages.length ? (
                <img
                  src={safeImages[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              
              {safeImages.length > 1 && (
                <>
                  <Button variant="ghost" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white" onClick={prevImage}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white" onClick={nextImage}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            
            {safeImages.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {safeImages.map((image, index) => (
                  <button
                    key={index}
                    className={`w-20 h-20 rounded border-2 overflow-hidden flex-shrink-0 ${
                      index === currentImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            {typeof product.price === 'number' ? (
              <p className="text-3xl font-bold text-primary mb-4">
                ₹{product.price.toFixed(2)}
              </p>
            ) : (
              <p className="text-3xl font-bold text-primary mb-4">Price not available</p>
            )}
            
            <div className="flex items-center space-x-4 mb-4">
              <p className="text-sm text-gray-600">SKU: <span className="font-medium">{product.sku || "N/A"}</span></p>
              {product.category && (
                <p className="text-sm text-gray-600">Category: <span className="font-medium">{product.category.name}</span></p>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium mb-1">Availability:</p>
              {typeof product.stock === 'number' ? (
                product.stock > 5 ? <p className="text-green-600">In Stock</p> :
                product.stock > 0 ? <p className="text-amber-600">Low Stock (Only {product.stock} left)</p> :
                <p className="text-red-600">Out of Stock</p>
              ) : <p className="text-gray-500">Availability unknown</p>}
            </div>
            
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
            
            {Object.entries(variantGroups).length > 0 && (
              <div className="space-y-4 mb-6">
                {Object.entries(variantGroups).map(([name, values]) => (
                  <div key={name}>
                    <p className="text-sm font-medium mb-1">{name}:</p>
                    <Select value={selectedVariants[name] || ""} onValueChange={(value) => handleVariantChange(name, value)}>
                      <SelectTrigger className="w-full"><SelectValue placeholder={`Select ${name}`} /></SelectTrigger>
                      <SelectContent>
                        {values.map((value) => (<SelectItem key={value} value={value}>{value}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <p className="text-sm font-medium mr-4">Quantity:</p>
              <div className="flex items-center border rounded">
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={decrementQuantity} disabled={quantity <= 1}>-</Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={incrementQuantity} disabled={quantity >= (product.stock || 0) || (product.stock === 0)}>+</Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="flex-1" size="lg" onClick={handleAddToCart} disabled={typeof product.stock !== 'number' || product.stock === 0}>
                <ShoppingBag className="mr-2 h-5 w-5" />Add to Cart
              </Button>
              <Button variant="outline" className="flex-1" size="lg" onClick={handleAddToWatchlist}>
                <Heart className="mr-2 h-5 w-5" />Add to Watchlist
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center"><Truck className="h-5 w-5 mr-2 text-primary" /><span className="text-sm">Free Shipping</span></div>
              <div className="flex items-center"><Shield className="h-5 w-5 mr-2 text-primary" /><span className="text-sm">Quality Assurance</span></div>
              <div className="flex items-center"><Box className="h-5 w-5 mr-2 text-primary" /><span className="text-sm">Made in India</span></div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="shipping">Shipping Information</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="py-4">
              <h3 className="text-lg font-medium mb-4">Product Details</h3>
              <p>{product.description || "No additional details available."}</p>
            </TabsContent>
            <TabsContent value="shipping" className="py-4">
              <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
              <ul className="list-disc pl-5 space-y-2"><li>Free shipping</li><li>3-5 business days</li></ul>
            </TabsContent>
            <TabsContent value="reviews" className="py-4">
              <h3 className="text-lg font-medium mb-4">Reviews</h3><p>No reviews yet.</p>
            </TabsContent>
          </Tabs>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <Separator className="mb-8" />
            <ProductGrid products={relatedProducts} title="Related Products" />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;