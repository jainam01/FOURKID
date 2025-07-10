// File: client/src/pages/CheckoutPage.tsx

import { useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useCart, useCreateOrder, apiRequest } from "@/lib/api"; // Correctly import apiRequest, remove useApi
import { toast } from "react-hot-toast";
import { useLocation } from "wouter";
import { AlertTriangle, Lock } from "lucide-react";
import { CartItemWithProduct } from "@shared/schema";

// Load Stripe outside of a component’s render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// --- The Actual Checkout Form Component ---
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  // Removed the incorrect 'mutate: mutateCart' from useCart
  const { data: cart } = useCart();
  const createOrderMutation = useCreateOrder();
  const [, setLocation] = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements || !cart || cart.length === 0) return;

    setIsLoading(true);
    setErrorMessage(null);

    // Use apiRequest directly, as defined in your api.ts
    const res = await apiRequest("POST", '/api/create-payment-intent');
    const { clientSecret, error: backendError } = await res.json();

    if (backendError) {
      setErrorMessage(backendError.message);
      setIsLoading(false);
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsLoading(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (stripeError) {
      setErrorMessage(stripeError.message ?? "An unknown payment error occurred.");
      setIsLoading(false);
      return;
    }
    
    if (paymentIntent?.status === 'succeeded') {
      try {
        // useCreateOrder hook now correctly takes paymentIntentId
        await createOrderMutation.mutateAsync({ paymentIntentId: paymentIntent.id });
        // The mutateCart() call is removed. The useCreateOrder hook handles invalidation.
        setLocation("/orders");
      } catch (err) {
        toast.error("Payment succeeded, but failed to create order. Please contact support.");
        setErrorMessage("Failed to save your order. Please contact support.");
      }
    }
    
    setIsLoading(false);
  };
  
  const cardElementOptions = {
    style: {
      base: { color: "#32325d", fontFamily: 'Inter, sans-serif', fontSmoothing: "antialiased", fontSize: "16px", "::placeholder": { color: "#aab7c4" } },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    },
  };

  // Corrected reduce: access price via item.product.price
  const total = cart?.reduce((sum: number, item: CartItemWithProduct) => sum + (item.product.price * item.quantity), 0) || 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <CardElement options={cardElementOptions} />
        </div>
      </div>
      
      {errorMessage && 
        <div className="flex items-start text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">{errorMessage}</p>
        </div>
      }
      
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 text-base"
      >
        <Lock className="h-4 w-4 mr-2" />
        {isLoading ? "Processing..." : `Pay ₹${total.toFixed(2)}`}
      </Button>
    </form>
  );
};

// --- Main Checkout Page Component ---
export const CheckoutPage = () => {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return <div className="text-center py-20"><p className="text-lg text-gray-500">Loading Checkout...</p></div>;
  }
  
  if (!cart || cart.length === 0) {
    return (
        <div className="text-center py-20">
            <h2 className="text-xl font-semibold">Your cart is empty.</h2>
            <p className="text-gray-500 mt-2">Add items to your cart to proceed to checkout.</p>
        </div>
    );
  }

  // Corrected reduce: access price via item.product.price
  const totalAmount = cart.reduce((sum: number, item: CartItemWithProduct) => sum + (item.product.price * item.quantity), 0);

  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(totalAmount * 100),
    currency: 'inr',
    appearance: { theme: 'stripe' },
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-lg px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Secure Checkout</h1>
        <p className="text-center text-gray-500 mb-8">Complete your purchase below.</p>
        
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">Payments are securely processed by Stripe.</p>
      </div>
    </div>
  );
};

export default CheckoutPage;