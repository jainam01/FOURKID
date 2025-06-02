import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Images,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const AdminSidebar = ({ onNavigate }: AdminSidebarProps) => {
  const { data: user } = useUser();
  const logout = useLogout();
  const { toast } = useToast();
  const [location] = useLocation();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/categories", label: "Categories", icon: <Tag className="h-5 w-5" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/orders", label: "Orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/banners", label: "Banners", icon: <Images className="h-5 w-5" /> },
    { href: "/", label: "View Store", icon: <Store className="h-5 w-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location === "/admin";
    }
    return location.startsWith(href);
  };

  return (
    <div className="h-full bg-white border-r flex flex-col">
      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{user ? getUserInitials(user.name) : "AD"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant={isActive(item.href) ? "default" : "ghost"}
            className={`w-full justify-start ${isActive(item.href) ? "" : "text-gray-600"}`}
            asChild
            onClick={onNavigate}
          >
            <Link href={item.href}>
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t mt-auto">
        <Button variant="outline" className="w-full justify-start text-red-600" onClick={handleLogout}>
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
