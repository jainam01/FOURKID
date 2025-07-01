// File: client/src/pages/ProductDetail.tsx

import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { useToast } from "@/hooks/use-toast";
import { 
  useProduct, 
  useProducts, 
  useAddToCart, 
  useAddToWatchlist, 
  useAddReview,
  useCart
} from "@/lib/api";
import { useUser } from "@/lib/auth";
import { ProductVariant } from "@shared/schema";
import { Heart, ShoppingBag, Star, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProductGrid from "@/components/products/ProductGrid";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id);
  const [, navigate] = useLocation();
  const { data: product, isLoading, error } = useProduct(productId, { enabled: !!productId });
  const { data: allProducts = [] } = useProducts();
  const { data: cartItems = [] } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { toast } = useToast();
  const { data: user } = useUser();
  const addToCart = useAddToCart();
  const addToWatchlist = useAddToWatchlist();
  const addReview = useAddReview();

  const isProductInCart = (size?: string) => {
    if (!size) return false;
    return cartItems.some(item => 
      item.productId === productId && 
      item.variantInfo?.some(v => v.name === "Size" && v.value === size)
    );
  };
  
  const showGoToBagButton = isProductInCart(selectedSize);

  const sizeChartData = [
    { size: '2-3Y', chest: '22', length: '15.5', waist: '21' },
    { size: '3-4Y', chest: '23', length: '16.5', waist: '22' },
    { size: '4-5Y', chest: '24', length: '17.5', waist: '23' },
  ];

  useEffect(() => { setSelectedSize(undefined); }, [productId]);

  const handleAddToCart = () => {
    if (showGoToBagButton) {
      navigate('/cart');
      return;
    }
    
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to add items to your cart.", variant: "destructive" });
      navigate("/login"); return;
    }
    if (!product || product.stock === 0) {
      toast({ title: "Out of Stock", description: "This product is currently unavailable.", variant: "destructive" }); return;
    }
    if (sizeOptions.length > 0 && !selectedSize) {
      toast({ title: "Size Required", description: "Please select a size.", variant: "destructive" }); return;
    }
    const variantInfoForApi: ProductVariant[] = selectedSize ? [{ name: "Size", value: selectedSize }] : [];
    
    addToCart.mutate(
      { productId, quantity: 1, variantInfo: variantInfoForApi },
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
                <div className="flex flex-col">
                  <span className="font-bold">Added to bag</span>
                </div>
              </div>
            )
          });
        },
        onError: (err) => toast({ title: "Error", description: err.message || "Failed to add to cart.", variant: "destructive" })
      }
    );
  };
  
  const handleAddToWatchlist = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to add to your wishlist.", variant: "destructive" });
      navigate("/login"); return;
    }
    if (!product) return;
    addToWatchlist.mutate(
      { productId },
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
                <div className="flex flex-col">
                  <span className="font-bold">Added to wishlist</span>
                </div>
              </div>
            )
          });
        },
        onError: (err) => toast({ title: "Error", description: err.message || "Failed to add to wishlist.", variant: "destructive" })
      }
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "Login Required", description: "Please log in to submit a review.", variant: "destructive" });
        navigate("/login"); return;
    }
    if (rating === 0) {
        toast({ title: "Rating Required", description: "Please select a star rating.", variant: "destructive" }); return;
    }
    if (!comment) {
        toast({ title: "Comment Required", description: "Please write a comment.", variant: "destructive" }); return;
    }

    addReview.mutate({ productId, rating, comment }, {
        onSuccess: () => {
            toast({
              className: 'bg-gray-800 text-white border-none font-sans',
              duration: 3000,
              description: (
                <div className="flex items-center gap-3">
                   <Star className="h-6 w-6 text-yellow-400 fill-current" />
                   <span className="font-bold">Review Submitted</span>
                </div>
              )
            });
            setRating(0); setComment("");
        },
        onError: (err) => {
            toast({ title: "Submission Failed", description: err.message || "Could not submit review.", variant: "destructive" });
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

  const breadcrumbs = [];
  if (product?.category) {
    breadcrumbs.push({ name: 'Home', href: '/' });
    breadcrumbs.push({ name: product.category.name, href: `/category/${product.category.slug}` }); 
    breadcrumbs.push({ name: product.name, href: `/product/${product.id}` });
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Fourkids`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} from Fourkids.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 md:py-10">
      
        {breadcrumbs.length > 0 && (
          <div className="text-sm text-muted-foreground mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.name}>
                {index < breadcrumbs.length - 1 ? (
                  <a href={crumb.href} className="hover:text-primary">{crumb.name}</a>
                ) : (
                  <span className="font-semibold text-foreground">{crumb.name}</span>
                )}
                {index < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          <div className="grid grid-cols-1 gap-4">
            {safeImages.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden bg-gray-100">
                <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>

          <div className="sticky top-24 self-start">
            <h1 className="text-xl text-gray-500 mt-1 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold">₹{product.price * 0.8} <span className="text-lg text-gray-400 line-through">₹{product.price}</span> <span className="text-lg font-bold text-orange-500">(20% OFF)</span></p>
            <p className="text-sm font-semibold text-teal-600">inclusive of all taxes</p>
            <Separator className="my-6" />

            {sizeOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-base font-bold uppercase">SELECT SIZE</h3>
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="text-pink-500 h-auto p-0 font-bold">SIZE CHART</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Size Chart</DialogTitle>
                        <DialogDescription>
                          All measurements are in inches. This is a general guide.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-bold">Size</TableHead>
                              <TableHead className="text-center">Chest</TableHead>
                              <TableHead className="text-center">Waist</TableHead>
                              <TableHead className="text-center">Length</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sizeChartData.map((row) => (
                              <TableRow key={row.size}>
                                <TableCell className="font-medium">{row.size}</TableCell>
                                <TableCell className="text-center">{row.chest}"</TableCell>
                                <TableCell className="text-center">{row.waist}"</TableCell>
                                <TableCell className="text-center">{row.length}"</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(size => (
                    <Button key={size} variant="outline" className={`h-12 w-16 rounded-full border-2 ${selectedSize === size ? 'border-pink-500 text-pink-500 font-bold' : 'border-gray-300'}`} onClick={() => setSelectedSize(size)}>
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-4 mb-6">
              <Button size="lg" className="flex-1 bg-pink-500 hover:bg-pink-600 h-14 text-base" onClick={handleAddToCart} disabled={isOutOfStock || addToCart.isPending}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                {isOutOfStock ? "OUT OF STOCK" :
                 addToCart.isPending ? "ADDING..." :
                 showGoToBagButton ? "GO TO BAG" : "ADD TO BAG"
                }
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-base" onClick={handleAddToWatchlist} disabled={addToWatchlist.isPending}>
                 <Heart className="mr-2 h-4 w-4" />
                 {addToWatchlist.isPending ? "ADDING..." : "WISHLIST"}
              </Button>
            </div>
            
            <Separator className="my-6" />
            <div>
              <h3 className="text-base font-bold uppercase mb-3">PRODUCT DETAILS</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
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
                        <Button type="submit" className="bg-pink-500 hover:bg-pink-600" disabled={addReview.isPending}>
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