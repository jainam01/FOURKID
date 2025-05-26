import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useOrders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Package2, ChevronDown, ChevronUp, ExternalLink, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { OrderWithItems } from "@shared/schema";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";

const getStatusColor = (status: string | undefined) => {
  if (!status) return "bg-gray-100 text-gray-800";
  switch (status.toLowerCase()) {
    case 'pending':
      return "bg-yellow-100 text-yellow-800";
    case 'processing':
      return "bg-blue-100 text-blue-800";
    case 'shipped':
      return "bg-indigo-100 text-indigo-800";
    case 'delivered':
      return "bg-green-100 text-green-800";
    case 'cancelled':
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string | undefined) => {
  if (!status) return <Clock className="h-4 w-4" />;
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Package2 className="h-4 w-4" />;
    case 'shipped':
      return <Truck className="h-4 w-4" />;
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const OrderHistory = () => {
  const { data: orders = [], isLoading } = useOrders();
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);

  const toggleOrderExpand = (orderId: number) => {
    setExpandedOrderIds(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId) 
        : [...prev, orderId]
    );
  };

  const isOrderExpanded = (orderId: number) => {
    return expandedOrderIds.includes(orderId);
  };

  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center items-center min-h-[300px]">
          <p className="text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <>
        <Helmet>
          <title>Order History - Fourkids Wholesale</title>
          <meta name="description" content="View and track your wholesale orders from Fourkids." />
        </Helmet>
        
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Package2 className="h-16 w-16 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to place your first order.
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
        <title>Order History - Fourkids Wholesale</title>
        <meta name="description" content="View and track your wholesale orders from Fourkids." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Orders</h1>
          <Button asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
        
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 py-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      Order #{order.id}
                      <Badge variant="outline" className={`ml-3 ${getStatusColor(order.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </Badge>
                    </CardTitle>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <div className="text-sm">
                      Total: <span className="font-bold">₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <Collapsible open={isOrderExpanded(order.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full flex justify-between items-center p-4 rounded-none border-t">
                      <span>
                        {isOrderExpanded(order.id) 
                          ? 'Hide Order Details' 
                          : 'View Order Details'
                        }
                      </span>
                      {isOrderExpanded(order.id) 
                        ? <ChevronUp className="h-4 w-4" /> 
                        : <ChevronDown className="h-4 w-4" />
                      }
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="p-4 space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Shipping Address</h3>
                        <p className="text-sm">{order.address}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-medium mb-2">Order Items</h3>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-start space-x-4">
                              <div className="w-16 h-16 flex-shrink-0">
                                <img 
                                  src={item.product.images[0]} 
                                  alt={item.product.name} 
                                  className="w-full h-full object-cover rounded"
                                />
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">
                                    <Link href={`/product/${item.product.id}`} className="hover:text-primary hover:underline">
                                      {item.product.name}
                                    </Link>
                                  </h4>
                                  <p className="font-medium">₹{item.price.toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                {item.variantInfo && (
                                  <p className="text-sm text-gray-600">
                                    {item.variantInfo.map((v) => `${v.name}: ${v.value}`).join(', ')}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium mb-2">Payment Summary</h3>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>₹{(order.total / 1.18).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax (18% GST):</span>
                              <span>₹{(order.total - (order.total / 1.18)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>Free</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>₹{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Need Help?</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            For any questions about your order, please contact our customer support.
                          </p>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/support">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Contact Support
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
