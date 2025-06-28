// File: client/src/pages/ProductDetail.tsx

// --- CORRECTED IMPORTS: Only include hooks needed for this page ---
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  useProduct, 
  useProducts, 
  useAddToCart, 
  useAddToWatchlist, 
  useAddReview 
} from "@/lib/api";
import { useUser } from "@/lib/auth";
import { ProductVariant } from "@shared/schema";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ProductGrid from "@/components/products/ProductGrid";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const [, navigate] = useLocation();
  const { data: product, isLoading, error } = useProduct(productId, { enabled: !!productId });
  const { data: allProducts = [] } = useProducts();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  
  // State for the review form
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { toast } = useToast();
  const { data: user } = useUser();
  const addToCart = useAddToCart();
  const addToWatchlist = useAddToWatchlist();
  const addReview = useAddReview(); // Hook for submitting a NEW review

  useEffect(() => {
    setSelectedSize(undefined);
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to add items to your cart.", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!product || product.stock === 0) {
      toast({ title: "Out of Stock", description: "This product is currently unavailable.", variant: "destructive" });
      return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      toast({ title: "Size Required", description: "Please select a size before adding to cart.", variant: "destructive" });
      return;
    }
    const variantInfoForApi: ProductVariant[] = selectedSize ? [{ name: "Size", value: selectedSize }] : [];

    addToCart.mutate(
      { productId, quantity: 1, variantInfo: variantInfoForApi },
      { onSuccess: () => toast({ title: "Added to cart!", description: `"${product.name}" is now in your cart.` }),
        onError: (err) => toast({ title: "Error", description: err.message || "Failed to add to cart.", variant: "destructive" })
      }
    );
  };
  
  const handleAddToWatchlist = () => { /* ... (implementation needed) ... */ };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Login Required", description: "Please log in to submit a review.", variant: "destructive" });
        navigate("/login");
        return;
    }
    if (rating === 0) {
        toast({ title: "Rating Required", description: "Please select a star rating.", variant: "destructive" });
        return;
    }
    if (!comment) {
        toast({ title: "Comment Required", description: "Please write a comment.", variant: "destructive" });
        return;
    }

    addReview.mutate({ productId, rating, comment }, {
        onSuccess: () => {
            toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
            setRating(0);
            setComment("");
        },
        onError: (err) => {
            toast({ title: "Submission Failed", description: err.message || "Could not submit your review.", variant: "destructive" });
        }
    });
  };

  const relatedProducts = allProducts.filter(p => product && p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const safeImages = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [];
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  const sizeOptions = product?.variants?.filter(v => v.name.toLowerCase() === 'size').map(v => v.value) || [];

  if (isLoading) return <div className="container p-8 text-center">Loading product...</div>;
  if (error || !product) return <div className="container p-8 text-center text-red-500">Product not found.</div>;

  const isOutOfStock = product.stock === 0;

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Fourkids`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} from Fourkids.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {safeImages.map((image, index) => (
              <div key={index} className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100 ${index === 0 ? "col-span-2 row-span-2" : ""}`}>
                <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {safeImages.length === 0 && (
              <div className="col-span-2 row-span-2 aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-muted-foreground">No Images Available</p>
              </div>
            )}
          </div>

          <div className="sticky top-24 self-start">
            <h2 className="text-2xl font-bold text-gray-800">{product.businessName}</h2>
            <h1 className="text-xl text-gray-500 mt-1 mb-4">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">{formatPrice(product.price * 0.8)}</span>
              <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              <span className="text-lg font-bold text-orange-500">(20% OFF)</span>
            </div>
            <p className="text-sm font-semibold text-teal-600">inclusive of all taxes</p>
            <Separator className="my-6" />
            {sizeOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold uppercase">Select Size</h3>
                  <Button variant="link" className="text-primary h-auto p-0">Size Chart</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <Button key={size} variant={selectedSize === size ? "default" : "outline"} className={`rounded-full h-12 w-12 text-base ${selectedSize === size ? "bg-primary text-primary-foreground" : ""}`} onClick={() => setSelectedSize(size)}>
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 mb-6">
              <Button size="lg" className="flex-1 bg-blue-500 hover:bg-blue-600 h-14 text-base" onClick={handleAddToCart} disabled={isOutOfStock}>
                <ShoppingBag className="mr-2 h-5 w-5"/> ADD TO BAG
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-base" onClick={handleAddToWatchlist}>
                <Heart className="mr-2 h-5 w-5"/> WISHLIST
              </Button>
            </div>
            {isOutOfStock && <Badge variant="destructive" className="w-full justify-center py-2 text-base">OUT OF STOCK</Badge>}
            <Separator className="my-6" />
            <div>
              <h3 className="text-base font-bold uppercase mb-3">Product Details</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                {/* <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-gray-800">4.2</span>
                        <Star className="h-8 w-8 text-teal-500 fill-current" />
                    </div>
                    <p className="text-lg text-muted-foreground mt-2">1.2k Ratings</p>
                </div> */}
                <div>
                    <form onSubmit={handleReviewSubmit}>
                        <h3 className="text-lg font-semibold mb-2">Write a Review</h3>
                        <div className="flex items-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`h-8 w-8 cursor-pointer transition-colors ${ (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300" }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    fill="currentColor"
                                />
                            ))}
                        </div>
                        <Textarea
                            placeholder="Share your thoughts about the product..."
                            className="mb-4 min-h-[120px]"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={addReview.isPending}>
                            {addReview.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16"><Separator className="mb-12" /><ProductGrid products={relatedProducts} title="Similar Products" /></div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;