import { Helmet } from "react-helmet-async";
import { useOrders } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, CheckCircle, Truck, AlertCircle, Package2, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Re-tuned color utility for the new minimalist theme
const getStatusStyles = (status: string | undefined) => {
  const s = status?.toLowerCase() || '';
  let icon = <Clock className="h-4 w-4" />;
  let className = "bg-slate-100 text-slate-800"; // Default

  if (s === 'pending payment' || s === 'pending') {
    className = "bg-yellow-100/80 text-yellow-800";
    icon = <Clock className="h-4 w-4" />;
  } else if (s === 'processing') {
    className = "bg-sky-100/80 text-sky-800";
    icon = <Package2 className="h-4 w-4" />;
  } else if (s === 'shipped') {
    className = "bg-teal-100/80 text-teal-800";
    icon = <Truck className="h-4 w-4" />;
  } else if (s === 'delivered') {
    className = "bg-emerald-100/80 text-emerald-800";
    icon = <CheckCircle className="h-4 w-4" />;
  } else if (s.includes('cancelled') || s.includes('rejected')) {
    className = "bg-red-100/80 text-red-800";
    icon = <AlertCircle className="h-4 w-4" />;
  }
  
  return { className, icon };
};

const OrderHistory = () => {
  const { data: orders = [], isLoading, error } = useOrders();
  const [, navigate] = useLocation();

  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleRowClick = (orderId: number) => {
    navigate(`/orders/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto"></div>
        <p className="mt-4 text-lg text-slate-600">Loading Your Orders...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-red-600">Failed to load orders</h1>
        <p className="text-slate-600">There was a problem fetching your order history. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders - Fourkids</title>
        <meta name="description" content="View and track your orders from Fourkids." />
      </Helmet>
      
      <div className="bg-[#F9FAFB] min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8">
              Orders
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-slate-200">
                    <Package2 className="h-20 w-20 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold mb-4 text-slate-700">No Orders Found</h2>
                    <p className="text-slate-500 mb-8">You haven't placed any orders yet.</p>
                    <Button size="lg" asChild className="bg-slate-800 hover:bg-slate-700 text-white">
                        <a href="/">Continue Shopping</a>
                    </Button>
                </div>
            ) : (
                <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b-slate-200/80 bg-slate-50">
                        <TableHead className="py-3 px-6 text-slate-500 font-semibold">Order</TableHead>
                        <TableHead className="py-3 px-6 text-slate-500 font-semibold">Date</TableHead>
                        <TableHead className="py-3 px-6 text-slate-500 font-semibold">Status</TableHead>
                        <TableHead className="py-3 px-6 text-slate-500 font-semibold text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedOrders.map((order) => {
                        const { className, icon } = getStatusStyles(order.status);
                        return (
                          <TableRow 
                            key={order.id} 
                            className="border-b-slate-200/80 cursor-pointer hover:bg-slate-50/50"
                            onClick={() => handleRowClick(order.id)}
                          >
                            <TableCell className="py-4 px-6 font-medium text-slate-800">#{order.id}</TableCell>
                            <TableCell className="py-4 px-6 text-slate-600">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</TableCell>
                            <TableCell className="py-4 px-6">
                              <Badge variant="outline" className={`border-0 capitalize font-medium ${className}`}>
                                {icon}
                                <span className="ml-1.5">{order.status}</span>
                              </Badge>
                            </TableCell>
                            <TableCell className="py-4 px-6 text-right font-medium text-slate-800">₹{order.total.toFixed(2)}</TableCell>
                            <TableCell className="py-4 px-6 text-right">
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default OrderHistory;