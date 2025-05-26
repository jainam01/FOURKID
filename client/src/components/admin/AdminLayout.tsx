// src/layouts/AdminLayout.tsx
import React from "react";
import { useLocation, Redirect } from "wouter"; // Import Redirect
import { useUser, isAdmin } from "@/lib/auth"; // Ensure isAdmin correctly checks user.role === 'admin'
import AdminSidebar from "@/components/admin/AdminSidebar"; // Adjust path if needed
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile"; // Assuming this hook works correctly

interface AdminLayoutProps {
  children: React.ReactNode; // This will be the specific admin page component
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { data: user, isLoading } = useUser();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Redirect to login if not admin - This logic is good
  // However, Wouter's navigate should ideally be called outside render or within useEffect
  // Using <Redirect /> is more idiomatic for wouter within render flow
  if (!isLoading && (!user || !isAdmin(user))) {
    return <Redirect to="/login" />; // Use Redirect component for navigation during render
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        Loading Admin Panel...
      </div>
    );
  }

  // If after loading, still no admin user, this shouldn't be reached due to Redirect above
  // but as a fallback:
  if (!user || !isAdmin(user)) {
     // This state should ideally not be reached if Redirect works.
     // If it is, it means there's a flicker or a logic path missed.
    console.warn("AdminLayout rendered without admin user despite checks. Redirecting.");
    return <Redirect to="/login" />;
  }


  return (
    <div className="min-h-screen bg-gray-100"> {/* Changed bg-gray-50 to bg-gray-100 for typical admin panel */}
      <div className="flex">
        {/* Mobile Sidebar Toggle & Sheet */}
        {isMobile && (
          <>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                {/* Position the button fixed, or relative to a small header bar for admin mobile */}
                <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[260px]"> {/* Adjusted width */}
                <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            {/* Add padding to main content to prevent overlap with fixed menu button */}
            <div className={`flex-1 pt-20`}> {/* pt-20 or similar to clear fixed menu button */}
              <main className="p-4 md:p-6">
                {children}
              </main>
            </div>
          </>
        )}

        {/* Desktop Sidebar - fixed */}
        {!isMobile && (
          <>
            <div className="w-64 fixed inset-y-0 z-30 hidden md:block"> {/* Ensure z-index is appropriate */}
              <AdminSidebar />
            </div>
            <div className="flex-1 md:ml-64"> {/* Ensure this class is applied correctly */}
              <main className="p-6">
                {children}
              </main>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLayout;