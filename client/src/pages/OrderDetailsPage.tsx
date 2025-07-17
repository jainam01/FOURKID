import { useOrder } from "@/lib/api";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, MessageSquare, ImageOff } from "lucide-react";

// This is the reusable prompt for payment verification.
const PaymentVerificationPrompt = () => (
    <Card className="p-8 text-center bg-blue-50 border-blue-200 mb-8 shadow-lg">
        <CheckCircle className="mx-auto h-16 w-16 text-blue-500 mb-4" />
        <h2 className="text-2xl font-bold">Thank You for Your Order!</h2>
        <p className="text-gray-700 mt-4">
            Please upload or send your payment slip for verification. 
            
        </p>
        <div className="mt-6 space-y-3">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <a href="https://wa.me/918758586464" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-5 w-5" /> Send on WhatsApp
                </a>
            </Button>
            <Button asChild variant="secondary" className="w-full">
                <a href="mailto:arihant.8758586464@gmail.com">
                    <Mail className="mr-2 h-5 w-5" /> Send via Email
                </a>
            </Button>
        </div>
        <p className="text-s text-gray-500 mt-6">Your order will be processed after our admin verifies your payment.</p>
        
    </Card>
);


export const OrderDetailsPage = () => {
    const { id } = useParams();
    const { data: order, isLoading, error } = useOrder(Number(id));

    if (isLoading) return <div className="text-center py-20">Loading order details...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Error: {error.message}</div>;
    if (!order) return <div className="text-center py-20">Order not found.</div>;

    return (
        <div className="container mx-auto max-w-4xl py-12">

            {/* *** THE KEY LOGIC *** */}
            {/* This prompt will ONLY show if the order status is 'pending payment' */}
            {order.status.toLowerCase() === 'pending payment' && <PaymentVerificationPrompt />}

            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <span>Order #{order.id}</span>
                        <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 capitalize">
                            {order.status}
                        </span>
                    </CardTitle>
                    <p className="text-sm text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Items ({order.items.length})</h3>
                        <Separator />
                        <ul className="divide-y divide-gray-200">
                            {order.items.map(item => (
                                <li key={item.id} className="flex items-center space-x-4 py-4">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                                    {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0]} alt={item.product.name || ''} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <ImageOff className="h-10 w-10 text-gray-400" />
                                    )}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-gray-800">{item.product?.name || 'Product not available'}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-700">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Address</h3>
                            <address className="not-italic text-gray-600 bg-gray-50 p-4 rounded-lg">{order.address}</address>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Total</h3>
                            <div className="space-y-1 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span className="font-bold text-lg text-black">₹{order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};