// File: client/src/pages/CheckoutPage.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { apiRequest, useCart, useCreateManualUpiOrder } from "@/lib/api";
import { useUser } from "@/lib/auth";
import { toast } from "react-hot-toast";
import { Link, useLocation } from "wouter"; // Import useLocation
import { QrCode, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Order } from "@shared/schema"; 

export const CheckoutPage = () => {
  const { data: user } = useUser();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const [upiDetails, setUpiDetails] = useState({ upiId: '', qrCodeUrl: '' });
  const [, navigate] = useLocation(); // Hook for navigation
  const createOrderMutation = useCreateManualUpiOrder();

  useEffect(() => {
    apiRequest("GET", '/api/settings/upi').then(res => res.json()).then(setUpiDetails);
  }, []);

  const handlePlaceOrder = async () => {
    await createOrderMutation.mutateAsync(undefined, {
      onSuccess: (newOrder: Order) => {
        toast.success("Order Placed! Please verify your payment.");
        // Redirect to the new order's details page
        navigate(`/orders/${newOrder.id}`);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to place your order.");
      }
    });
  };

  const copyUpiId = () => {
    if (!upiDetails.upiId) return;
    navigator.clipboard.writeText(upiDetails.upiId);
    toast.success("UPI ID Copied!");
  };
  
  // The 'orderPlaced' state is no longer needed, we redirect instead.

  if (isCartLoading) return <div className="text-center py-20">Loading...</div>;
  if (!cart || cart.length === 0) {
     return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty.</h2>
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
        </div>
     );
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = user?.address?.toLowerCase().includes('ahmedabad') ? 0 : 100;
  const tax = subtotal * 0.18;
  const totalAmount = subtotal + tax + shippingCost;

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Column: UPI Details */}
        <div>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Pay with UPI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Scan the QR code or use the UPI ID below to pay.</p>
              {upiDetails.qrCodeUrl ? (
                <img src={upiDetails.qrCodeUrl} alt="UPI QR Code" className="w-48 h-48 border rounded-lg mx-auto" />
              ) : (
                <div className="w-48 h-48 border rounded-lg bg-gray-100 flex items-center justify-center mx-auto">
                    <QrCode className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <p className="font-semibold mt-2">Scan to Pay</p>
              <Separator className="my-4" />
              <p className="text-gray-600">Or copy UPI ID:</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="font-mono text-lg bg-gray-100 px-4 py-2 rounded-md">{upiDetails.upiId || 'loading...'}</p>
                  <Button variant="ghost" size="icon" onClick={copyUpiId}><Copy className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary and Place Order Button */}
        <div>
            <Card className="p-6 sticky top-8">
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Tax (18%)</span><span>₹{tax.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span>Shipping</span><span>{shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'Free'}</span></div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total to Pay</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <Button 
                        onClick={handlePlaceOrder} 
                        disabled={createOrderMutation.isPending} 
                        className="w-full mt-6 text-lg py-6 bg-pink-500 hover:bg-pink-600"
                    >
                        {createOrderMutation.isPending ? "Placing..." : "Place Order & Confirm Payment"}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
};