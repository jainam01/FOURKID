import { useState, useEffect } from "react"; // Added useEffect
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useCart, useClearCart, useCreateOrder } from "@/lib/api";
import { useUser } from "@/lib/auth";
import CartItemComponent from "@/components/cart/CartItem"; // Renamed to avoid conflict with type
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ChevronRight, Truck, CreditCard, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Removed AlertDialogTrigger as it's not used directly here

interface OrderResponse {
  id: number;
  address: string;
  createdAt: Date;
  userId: number;
  status: string;
  total: number;
}

const Cart = () => {
  const { data: user } = useUser();
  const { data: cartItemsData = [], isLoading } = useCart(); // Renamed to cartItemsData
  const clearCart = useClearCart();
  const createOrder = useCreateOrder();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Initialize shippingAddress from user.address when user data is available
  const [shippingAddress, setShippingAddress] = useState("");
  useEffect(() => {
    if (user && user.address) {
      setShippingAddress(user.address);
    }
  }, [user]);

  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  // Ensure cartItems always refers to a valid array
  const cartItems = Array.isArray(cartItemsData) ? cartItemsData : [];

  // Calculate totals robustly
  const subtotal = cartItems.reduce((sum, item) => {
    // Ensure product and price exist and are numbers
    const productPrice = item.product && typeof item.product.price === 'number' ? item.product.price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 1; // Default to 1 if quantity is odd

    if (item.product && typeof item.product.price !== 'number') {
      console.warn(`Cart item product (ID: ${item.productId}) has invalid price:`, item.product.price);
    }

    return sum + (productPrice * itemQuantity);
  }, 0);

  const shipping = subtotal > 0 ? 0 : 0; // Free shipping (can be more complex)
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleClearCart = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart."
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to clear cart. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  const handleCheckout = () => {
    if (!shippingAddress.trim()) {
      toast({
        title: "Address required",
        description: "Please provide a shipping address.",
        variant: "destructive"
      });
      return;
    }
    if (cartItems.length === 0) {
      toast({ title: "Empty Cart", description: "Your cart is empty.", variant: "destructive" });
      return;
    }
    setIsConfirmingOrder(true);
  };

  const confirmOrder = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please log in to place an order.", variant: "destructive" });
      setIsConfirmingOrder(false);
      navigate("/login");
      return;
    }

    const orderItemsPayload = cartItems.map(item => {
      const productPrice = item.product && typeof item.product.price === 'number' ? item.product.price : 0;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: productPrice,
        variantInfo: item.variantInfo ? item.variantInfo[0] : null
      };
    });

    // Filter out items with potentially problematic data before sending to API
    const validOrderItems = orderItemsPayload.filter(item => item.productId && typeof item.quantity === 'number' && typeof item.price === 'number');

    if (validOrderItems.length !== orderItemsPayload.length) {
      console.error("Some cart items had invalid data and were excluded from the order.");
      toast({ title: "Order Issue", description: "Some items in your cart have issues. Please review your cart.", variant: "destructive" });
      setIsConfirmingOrder(false);
      return;
    }

    if (validOrderItems.length === 0) {
      toast({ title: "Empty Order", description: "No valid items to order.", variant: "destructive" });
      setIsConfirmingOrder(false);
      return;
    }

    createOrder.mutate(
      {
        items: validOrderItems,
        address: shippingAddress,
        total // Ensure total is correctly calculated and up-to-date
      },
      {
        onSuccess: (data: OrderResponse) => {
          toast({
            title: "Order placed",
            description: `Your order #${data.id} has been successfully placed.`,
          });
          navigate(`/orders`); // Consider navigating to order detail page: /orders/${data.id}
        },
        onError: (error: Error) => {
          console.error("Order creation error:", error);
          toast({
            title: "Order Error",
            description: "Failed to place your order. Please try again or contact support.",
            variant: "destructive"
          });
        },
        onSettled: () => {
          setIsConfirmingOrder(false);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[300px]">
        <p className="text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart - Fourkids Wholesale</title>
          <meta name="description" content="View and manage items in your wholesale shopping cart." />
        </Helmet>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-6">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button>
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
        <title>{`Your Cart (${cartItems ? cartItems.length : 0}) - Fourkids Wholesale`}</title>
        <meta name="description" content="View and manage items in your wholesale shopping cart." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Cart Items ({cartItems.length})</h2>
                {cartItems.length > 0 && (
                  <Button
                    onClick={handleClearCart}
                    disabled={clearCart.isPending}
                  >
                    Clear Cart
                  </Button>
                )}
              </div>

              <div className="divide-y">
                {cartItems.map(item => (
                  // Ensure CartItemComponent props match what it expects
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                    <Textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Enter your complete shipping address"
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Free shipping across India</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={createOrder.isPending || cartItems.length === 0}
                >
                  Proceed to Checkout
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <AlertDialog open={isConfirmingOrder} onOpenChange={setIsConfirmingOrder}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
              <AlertDialogDescription>
                Please review your order details before confirming.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold">₹{total.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-medium">Shipping Address:</span>
                <p className="mt-1 text-sm break-words">{shippingAddress || "Not provided"}</p>
              </div>
              <div>
                <span className="font-medium">Number of Items:</span>
                <p className="mt-1 text-sm">{cartItems.length} product(s)</p>
              </div>
              <div className="flex items-start p-3 bg-amber-50 rounded text-amber-800 text-sm">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <span>By confirming, you agree to the terms and conditions. Orders cannot be easily modified or cancelled once placed.</span>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={createOrder.isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmOrder} disabled={createOrder.isPending}>
                {createOrder.isPending ? "Processing..." : "Confirm & Place Order"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default Cart;