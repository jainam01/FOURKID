// File: client/src/pages/Cart.tsx

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useCart, useClearCart } from "@/lib/api"; // Removed useCreateOrder
import CartItemComponent from "@/components/cart/CartItem";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ChevronRight, Truck, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { data: cartItemsData = [], isLoading } = useCart();
  const clearCart = useClearCart();
  const { toast } = useToast();

  const cartItems = Array.isArray(cartItemsData) ? cartItemsData : [];

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = 0; // Free shipping
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + tax;

  const handleClearCart = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => toast({ title: "Cart cleared" }),
      onError: () => toast({ title: "Error clearing cart", variant: "destructive" }),
    });
  };

  if (isLoading) {
    return <div className="container p-16 text-center">Loading your cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart - Fourkids Wholesale</title>
        </Helmet>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started.</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Your Cart (${cartItems.length}) - Fourkids Wholesale`}</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Cart Items ({cartItems.length})</h2>
                <Button onClick={handleClearCart} disabled={clearCart.isPending}>
                  Clear Cart
                </Button>
              </div>
              <div className="divide-y">
                {cartItems.map(item => <CartItemComponent key={item.id} item={item} />)}
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
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
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
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;