// File: client/src/pages/OrderHistory.tsx

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOrders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Package2, ChevronDown, ChevronUp, ExternalLink, Clock, Truck, CheckCircle, AlertCircle, ImageOff, FileText, ArrowRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

// Enhanced color utility for better visual feedback
const getStatusStyles = (status: string | undefined) => {
  if (!status) return { badge: "bg-gray-100 text-gray-800", border: "border-gray-300", icon: <Clock className="h-4 w-4" /> };
  switch (status.toLowerCase()) {
    case 'pending':
      return { badge: "bg-yellow-100 text-yellow-800", border: "border-yellow-400", icon: <Clock className="h-4 w-4" /> };
    case 'processing':
      return { badge: "bg-sky-100 text-sky-800", border: "border-sky-400", icon: <Package2 className="h-4 w-4" /> };
    case 'shipped':
      return { badge: "bg-indigo-100 text-indigo-800", border: "border-indigo-400", icon: <Truck className="h-4 w-4" /> };
    case 'delivered':
      return { badge: "bg-green-100 text-green-800", border: "border-green-400", icon: <CheckCircle className="h-4 w-4" /> };
    case 'cancelled':
      return { badge: "bg-red-100 text-red-800", border: "border-red-400", icon: <AlertCircle className="h-4 w-4" /> };
    default:
      return { badge: "bg-gray-100 text-gray-800", border: "border-gray-300", icon: <Clock className="h-4 w-4" /> };
  }
};

const OrderHistory = () => {
  const { data: orders = [], isLoading, error } = useOrders();
  const [openOrderId, setOpenOrderId] = useState<number | null>(null);

  const toggleOrderExpand = (orderId: number) => {
    setOpenOrderId(prevId => prevId === orderId ? null : orderId);
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Loading Your Orders...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-red-600">Failed to load orders</h1>
        <p className="text-gray-600">There was a problem fetching your order history. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Fourkids Wholesale</title>
        <meta name="description" content="View and track your wholesale orders from Fourkids." />
      </Helmet>
      
      <div className="bg-gray-50/50">
        <div className="container mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-xl p-8 mb-10 text-white shadow-lg">
                <h1 className="text-4xl font-bold">My Orders</h1>
                <p className="mt-2 text-sky-100">Track, manage, and review your past orders all in one place.</p>
            </div>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Package2 className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
                    <p className="text-gray-600 mb-8">Looks like you haven't placed an order yet. Let's change that!</p>
                    <Button size="lg" asChild className="bg-sky-500 hover:bg-sky-600 text-white">
                        <Link href="/">Start Shopping <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                {sortedOrders.map((order) => {
                    const status = getStatusStyles(order.status);
                    const isExpanded = openOrderId === order.id;

                    return (
                    <Collapsible key={order.id} open={isExpanded} onOpenChange={() => toggleOrderExpand(order.id)}>
                        <Card className={`overflow-hidden transition-all duration-300 shadow-md hover:shadow-xl border-l-4 ${status.border}`}>
                        <CardHeader className="p-4 cursor-pointer">
                            <CollapsibleTrigger asChild>
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-bold text-lg text-gray-800">#{order.id}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Date Placed</p>
                                    <p className="font-semibold text-gray-700">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-lg text-gray-800">₹{order.total.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={`py-1 px-3 text-sm ${status.badge}`}>
                                        {status.icon}
                                        <span className="ml-2 capitalize">{order.status}</span>
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="w-9 p-0">
                                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </div>
                            </CollapsibleTrigger>
                        </CardHeader>
                        
                        <CollapsibleContent>
                            <div className="bg-white p-6 border-t">
                            <OrderStatusTracker status={order.status || 'pending'} />

                            <Separator className="my-6" />
                            
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Order Items ({order.items.length})</h3>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-50">
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                                    {item.product?.images?.[0] ? (
                                        <img src={item.product.images[0]} alt={item.product.name || ''} className="w-full h-full object-cover rounded-md" />
                                    ) : (
                                        <ImageOff className="h-10 w-10 text-gray-400" />
                                    )}
                                    </div>
                                    <div className="flex-grow">
                                        <Link href={`/product/${item.product?.id}`} className="font-bold text-gray-800 hover:text-sky-600 transition-colors">
                                        {item.product?.name || 'Product not available'}
                                        </Link>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-700">₹{item.price.toFixed(2)}</p>
                                </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Shipping Address</h3>
                                    <address className="not-italic text-gray-600 bg-gray-50 p-4 rounded-lg">{order.address}</address>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
                                    <div className="flex flex-col space-y-3">
                                        <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Get Invoice</Button>
                                        {order.status?.toLowerCase() === 'shipped' && <Button><Truck className="mr-2 h-4 w-4" /> Track Package</Button>}
                                        <Button variant="ghost" asChild><Link href="/support">Contact Support <ExternalLink className="ml-2 h-4 w-4" /></Link></Button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </CollapsibleContent>
                        </Card>
                    </Collapsible>
                    );
                })}
                </div>
            )}
        </div>
      </div>
    </>
  );
};

// Helper Component: OrderStatusTracker
// You can place this at the bottom of the OrderHistory.tsx file
interface OrderStatusTrackerProps {
  status: string;
}

const OrderStatusTracker = ({ status }: OrderStatusTrackerProps) => {
  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.findIndex(step => step.toLowerCase() === status.toLowerCase());

  const getStepClass = (index: number) => {
    if (index < currentStepIndex) return 'bg-green-500 text-white'; // Completed
    if (index === currentStepIndex) return 'bg-sky-500 text-white'; // Current
    return 'bg-gray-200 text-gray-500'; // Upcoming
  };
  
  const getLineClass = (index: number) => {
    if (index < currentStepIndex) return 'bg-green-500';
    return 'bg-gray-200';
  };

  return (
    <div className="w-full px-2 py-4">
        <h3 className="text-md font-semibold mb-6 text-gray-800">Order Progress</h3>
        <div className="flex items-center">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center w-full">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${getStepClass(index)}`}>
                            {index + 1}
                        </div>
                        <p className={`mt-2 text-xs text-center font-medium ${index <= currentStepIndex ? 'text-gray-700' : 'text-gray-400'}`}>
                            {step}
                        </p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={`flex-auto h-1 transition-colors duration-300 ${getLineClass(index)}`}></div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default OrderHistory;