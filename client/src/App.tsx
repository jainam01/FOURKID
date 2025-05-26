// src/App.tsx
import { Switch, Route, useLocation as useWouterLocation } from "wouter"; // Import useWouterLocation
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layouts & Global Components
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import AdminLayout from "@/components/admin/AdminLayout"; // Assuming this is your AdminLayout path

// Page Components
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ProductDetail from "@/pages/ProductDetail";
import CategoryPage from "@/pages/CategoryPage";
import Cart from "@/pages/Cart";
import Watchlist from "@/pages/Watchlist";
import Profile from "@/pages/Profile";
import OrderHistory from "@/pages/OrderHistory";
import Support from "@/components/layout/header/Support";
import WholesaleProgram from "@/components/layout/header/WholesaleProgram";
import AboutUs from "@/components/layout/header/AboutUs";
import ContactUs from "@/components/layout/footer/contact";
import FAQPage from "@/components/layout/footer/faq";
// Admin Page Components (these will be children of AdminLayout)
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageProducts from "@/pages/admin/ManageProducts";
import ManageCategories from "@/pages/admin/ManageCategories";
import ManageOrders from "@/pages/admin/ManageOrders";
import ManageUsers from "@/pages/admin/ManageUsers";
import ManageBanners from "@/pages/admin/ManageBanners";
import ProductForm from "@/pages/admin/ProductForm";
import CategoryForm from "@/pages/admin/CategoryForm";
import ShippingPolicy from "./components/layout/footer/Information/ShippingPolicy";
import RefundPolicy from "./components/layout/footer/Information/RefundPolicy";
import TermsAndConditions from "@/components/layout/footer/Information/t&c";
import PrivacyPolicy from "@/components/layout/footer/Information/PrivacyPolicy";
import ScrollToTop from "@/lib/ScrollToTop";
// Contexts (if needed at this level, otherwise they might be within specific layouts)
// For simplicity, let's assume they are not strictly needed to wrap the entire App
// but rather specific parts (e.g., CartProvider around non-admin routes if Admin doesn't use cart)

function App() {
  const [location] = useWouterLocation(); // Get current location
  const isAdminRoute = location.startsWith("/admin");

  // Centralized Router for Admin pages (to be passed to AdminLayout)
  const AdminRoutes = () => (
    <Switch>
      <Route path="/admin" component={AdminDashboard} /> {/* Default admin page */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/products" component={ManageProducts} />
      <Route path="/admin/products/new" component={ProductForm} />
      <Route path="/admin/products/edit/:id" component={ProductForm} />
      <Route path="/admin/categories" component={ManageCategories} />
      <Route path="/admin/categories/new" component={CategoryForm} />
      <Route path="/admin/categories/edit/:id" component={CategoryForm} />
      <Route path="/admin/orders" component={ManageOrders} />
      <Route path="/admin/users" component={ManageUsers} />
      <Route path="/admin/banners" component={ManageBanners} />
      {/* Fallback for unknown admin sub-routes, can redirect or show admin 404 */}
      <Route>
        <NotFound /> {/* Or a specific AdminNotFound component */}
      </Route>
    </Switch>
  );

  // Router for Public/User pages
  const PublicUserRoutes = () => (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ScrollToTop />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />

          
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/product/:id" component={ProductDetail} />
          <Route path="/category/:slug" component={CategoryPage} />
          <Route path="/cart" component={Cart} />
{/*           
          //Assuming Cart is protected by its own logic or a wrapper */}
          <Route path="/watchlist" component={Watchlist} />
          <Route path="/profile" component={Profile} />
          <Route path="/orders" component={OrderHistory} />
          <Route path="/support" component={Support} />
          <Route path="/contact" component={ContactUs} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/shipping-policy" component={ShippingPolicy} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/terms" component={TermsAndConditions} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/wholesale-program" component={WholesaleProgram} />
          <Route path="/about" component={AboutUs} />
          {/* Fallback for non-admin, non-matched routes */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );


  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isAdminRoute ? (
          <AdminLayout>  {/* <--- Use AdminLayout here */}
            <AdminRoutes />  {/* <--- Pass AdminRoutes as children */}
          </AdminLayout>
        ) : (
          <PublicUserRoutes />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
export default App;