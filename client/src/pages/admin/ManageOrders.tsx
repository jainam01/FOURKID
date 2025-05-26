import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders, useUpdateOrderStatus } from "@/lib/api";
import { Clock, Eye, MoreHorizontal, Search, TruckIcon, CheckCircle, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { OrderWithItems } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-indigo-100 text-indigo-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock className="h-4 w-4 mr-2" />;
    case "processing":
      return <Clock className="h-4 w-4 mr-2" />;
    case "shipped":
      return <TruckIcon className="h-4 w-4 mr-2" />;
    case "delivered":
      return <CheckCircle className="h-4 w-4 mr-2" />;
    case "cancelled":
      return <X className="h-4 w-4 mr-2" />;
    default:
      return <Clock className="h-4 w-4 mr-2" />;
  }
};

const ManageOrders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewOrder, setViewOrder] = useState<OrderWithItems | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchQuery) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Sort by most recent first
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleUpdateStatus = async () => {
    if (!viewOrder || !newStatus) return;
    
    try {
      await updateOrderStatus.mutateAsync({ id: viewOrder.id, status: newStatus });
      toast({
        title: "Status updated",
        description: `Order #${viewOrder.id} status has been updated to ${newStatus}.`
      });
      setNewStatus("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>Manage Orders - Fourkids Wholesale</title>
        <meta name="description" content="Manage customer orders for Fourkids wholesale e-commerce platform" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="">All Statuses</SelectItem> */}
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading orders...</div>
      ) : (
        <>
          {sortedOrders.length === 0 ? (
            <div className="py-8 text-center border rounded-lg">
              {searchQuery || statusFilter ? "No orders match your filters." : "No orders found."}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">#{order.id}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewOrder(order)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}

      {/* Order Details Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order #{viewOrder?.id}</DialogTitle>
            <DialogDescription>
              Placed on {viewOrder && format(new Date(viewOrder.createdAt), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Order Status</h3>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(viewOrder.status)}>
                      <span className="flex items-center">
                        {getStatusIcon(viewOrder.status)}
                        <span className="capitalize">{viewOrder.status}</span>
                      </span>
                    </Badge>
                    
                    <div className="flex items-center gap-2">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="sm" 
                        onClick={handleUpdateStatus}
                        disabled={!newStatus || newStatus === viewOrder.status}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm mb-4 p-3 bg-gray-50 rounded border">
                    {viewOrder.address}
                  </p>
                  
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{(viewOrder.total / 1.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18% GST):</span>
                      <span>₹{(viewOrder.total - (viewOrder.total / 1.18)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>₹{viewOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded border">
                        <div className="w-16 h-16 bg-white border rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {item.product.sku}</div>
                          {item.variantInfo && (
                            <div className="text-sm text-gray-500">
                              {((item.variantInfo as unknown) as Array<{ name: string; value: string }>).map((v) => `${v.name}: ${v.value}`).join(', ')}
                            </div>
                          )}
                          <div className="mt-1 flex justify-between">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setViewOrder(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageOrders;
