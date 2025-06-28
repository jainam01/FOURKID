import { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOrders, useUpdateOrderStatus } from "@/lib/api";
import { Clock, Eye, Truck, CheckCircle, X, Search, User as UserIcon, Package2, ImageOff, Mail, KeyRound } from "lucide-react";
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
import { OrderWithItems, ProductVariant, User } from "@shared/schema";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-4 w-4 mr-2" /> };
    case "processing": return { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-4 w-4 mr-2" /> };
    case "shipped": return { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="h-4 w-4 mr-2" /> };
    case "delivered": return { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-4 w-4 mr-2" /> };
    case "cancelled": return { color: "bg-red-100 text-red-800", icon: <X className="h-4 w-4 mr-2" /> };
    default: return { color: "bg-gray-100 text-gray-800", icon: <Clock className="h-4 w-4 mr-2" /> };
  }
};
const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);

const ManageOrders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewOrder, setViewOrder] = useState<OrderWithItems | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(searchLower) ||
      (order.user?.name || `User ID: ${order.userId}`).toLowerCase().includes(searchLower) ||
      (order.user?.email || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleUpdateStatus = async () => {
    if (!viewOrder || !newStatus) return;
    try {
      await updateOrderStatus.mutateAsync({ id: viewOrder.id, status: newStatus });
      toast({ title: "Status updated", description: `Order #${viewOrder.id} status updated to ${newStatus}.` });
      setViewOrder(prev => prev ? { ...prev, status: newStatus } : null);
      setNewStatus("");
    } catch (error) {
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    }
  };

  const renderVariantInfo = (variantInfo: any) => {
    if (!variantInfo) return null;
    const variants = Array.isArray(variantInfo) ? variantInfo : [variantInfo];
    if (variants.length === 0) return null;
    return (<div className="text-sm text-gray-500">{variants.map((v, i) => <span key={i}>{v.name}: {v.value}</span>).reduce((prev, curr) => <>{prev}, {curr}</>)}</div>);
  };

  const CustomerInfoDropdown = ({ order }: { order: OrderWithItems }) => {
    // --- THE FIX IS HERE ---
    // If user data doesn't exist, return a valid JSX element (a span).
    // This prevents the "Type 'void' is not assignable to type 'ReactNode'" error.
    if (!order.user) {
        return <span className="text-muted-foreground">User ID: {order.userId}</span>;
    }

    const { user } = order;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link" className="p-0 h-auto text-left font-medium">
            {user.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary"/>
                </div>
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.businessName}</p>
                </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="opacity-100">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="opacity-100">
                <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>User ID: {user.id}</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <>
      <Helmet><title>Manage Orders - Fourkids Admin</title></Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Manage Orders</h1><p className="text-muted-foreground">View and update customer orders.</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by Order ID, Customer, or Email..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="shipped">Shipped</SelectItem><SelectItem value="delivered">Delivered</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? ( <div className="py-8 text-center">Loading...</div> ) : 
       sortedOrders.length === 0 ? (
        <div className="py-12 text-center border-dashed border-2 rounded-lg"><p className="font-medium">No orders found.</p></div>
       ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block border rounded-lg">
            <Table>
              <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead className="text-center">Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {sortedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell><CustomerInfoDropdown order={order} /></TableCell>
                    <TableCell className="text-center">{order.items.length}</TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell><Badge className={cn("capitalize", getStatusStyles(order.status).color)}>{order.status}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => setViewOrder(order)}><Eye className="mr-2 h-4 w-4"/>View</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {sortedOrders.map((order) => (
              <Card key={order.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setViewOrder(order)}>
                <CardHeader className="flex flex-row justify-between items-start pb-2">
                  <div><p className="font-bold">Order #{order.id}</p><p className="text-sm text-muted-foreground">{format(new Date(order.createdAt), "MMM d, yyyy")}</p></div>
                  <Badge className={cn("capitalize", getStatusStyles(order.status).color)}>{order.status}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="font-medium text-muted-foreground">Customer:</p>
                    {order.user ? (
                        <p className="font-medium text-foreground">{order.user.name}</p>
                    ) : (
                        <p className="text-muted-foreground">User ID: {order.userId}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter><p className="font-semibold">{formatPrice(order.total)}</p></CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Order #{viewOrder?.id}</DialogTitle><DialogDescription>Placed on {viewOrder && format(new Date(viewOrder.createdAt), "MMMM d, yyyy")}</DialogDescription></DialogHeader>
          {viewOrder && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-1">
                <div>
                  <h3 className="font-medium mb-2">Update Status</h3>
                  <div className="flex items-center gap-2 mb-4"><Select value={newStatus} onValueChange={setNewStatus}><SelectTrigger><SelectValue placeholder="Change status..." /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="shipped">Shipped</SelectItem><SelectItem value="delivered">Delivered</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select><Button size="sm" onClick={handleUpdateStatus} disabled={!newStatus || newStatus === viewOrder.status}>Update</Button></div>
                  <h3 className="font-medium mb-2">Customer Details</h3>
                  <p className="text-sm p-3 bg-gray-50 rounded border"><strong>{viewOrder.user?.name || `User ID: ${viewOrder.userId}`}</strong><br/>{viewOrder.user?.email || 'Email not available'}</p>
                  <h3 className="font-medium mb-2 mt-4">Shipping Address</h3>
                  <p className="text-sm p-3 bg-gray-50 rounded border">{viewOrder.address}</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Order Items ({viewOrder.items.length})</h3>
                  <div className="space-y-3">
                    {viewOrder.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 border rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {item.product && item.product.images && item.product.images.length > 0 ? (<img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />) : (<ImageOff className="h-8 w-8 text-gray-400" />)}
                        </div>
                        <div className="flex-grow">
                          {item.product ? (<><p className="font-medium leading-tight">{item.product.name}</p><p className="text-sm text-gray-500">SKU: {item.product.sku}</p></>) : (<p className="font-medium text-red-500">Product data missing</p>)}
                          {renderVariantInfo(item.variantInfo)}
                          <div className="mt-1 flex justify-between items-baseline"><span className="text-sm text-muted-foreground">Qty: {item.quantity}</span><span className="font-medium">{formatPrice(item.price * item.quantity)}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-4"><Button variant="outline" onClick={() => setViewOrder(null)}>Close</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ManageOrders;