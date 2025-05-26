import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardStats from "@/components/admin/DashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/lib/api";
import { useOrders } from "@/lib/api";
import { useCategories } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowUpRight, Box, DollarSign, ShoppingBag, Users } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useOrders();
  const { data: categories = [] } = useCategories();

  // Calculate summary statistics
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter(order => order.status === "pending").length;

  // Get recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate low stock products
  const lowStockProducts = products.filter(product => product.stock <= 5);

  // Calculate product distribution by category
  const productsByCategory = categories.map(category => {
    const count = products.filter(product => product.categoryId === category.id).length;
    return { ...category, count };
  });

  return (
    <div>
      <Helmet>
        <title>Admin Dashboard - Fourkids</title>
        <meta name="description" content="Admin dashboard for Fourkids wholesale e-commerce platform" />
      </Helmet>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStats 
          title="Total Revenue" 
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          description="Total revenue from all orders"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: "+12.5%", positive: true }}
        />
        <DashboardStats 
          title="Orders" 
          value={totalOrders.toString()}
          description={`${pendingOrders} orders pending`}
          icon={<ShoppingBag className="h-5 w-5" />}
          trend={{ value: "+8.2%", positive: true }}
        />
        <DashboardStats 
          title="Products" 
          value={totalProducts.toString()}
          description={`${lowStockProducts.length} low stock`}
          icon={<Box className="h-5 w-5" />}
          trend={{ value: "+3.1%", positive: true }}
        />
        <DashboardStats 
          title="Categories" 
          value={categories.length.toString()}
          description="Active product categories"
          icon={<Users className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Showing the last 5 orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-right">₹{order.total.toFixed(2)}</div>
                      <div className={`text-sm text-right ${
                        order.status === "cancelled" ? "text-red-500" : 
                        order.status === "delivered" ? "text-green-500" : 
                        "text-blue-500"
                      }`}>
                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No orders to display
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products with 5 or fewer units remaining</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products" className="flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.slice(0, 5).map(product => (
                  <div key={product.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-right">₹{product.price.toFixed(2)}</div>
                      <div className="text-sm text-right text-red-500">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No low stock products
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
