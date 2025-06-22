import { Home, LayoutGrid, Search, User, ShieldCheck } from "lucide-react"; // Import a new icon for the admin panel
import { Link, useLocation } from "wouter";
import { useUser, isAdmin } from "@/lib/auth"; // Import the isAdmin helper function
import { cn } from "@/lib/utils";

type NavItem =
  | { href: string; label: string; icon: React.ElementType }
  | { action: () => void; label: string; icon: React.ElementType };

// The 'onSearchClick' prop remains the same
interface BottomNavProps {
  onSearchClick: () => void;
}

export const BottomNav = ({ onSearchClick }: BottomNavProps) => {
  const { data: user } = useUser();
  const [location] = useLocation();

  // --- THE CHANGE IS HERE: The navItems array is now built dynamically ---

  // Start with the items that are always visible
  const baseNavItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
  ];
  
  // Add the middle item based on user role
  if (user && isAdmin(user)) {
    // If user is an admin, show the "Admin" link
    baseNavItems.push({ href: "/admin", label: "Admin", icon: ShieldCheck });
  } else {
    // Otherwise, show the default "Categories" link
    baseNavItems.push({ href: "/categories", label: "Categories", icon: LayoutGrid });
  }

  // Add the remaining items that are always visible
  const finalNavItems: NavItem[] = [
    ...baseNavItems,
    { action: onSearchClick, label: "Search", icon: Search },
    {
      href: user ? "/profile" : "/login",
      label: user ? "Profile" : "Login",
      icon: User,
    },
  ];

  return (
    // The JSX for rendering the nav bar remains the same
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-gray-200 z-40 md:hidden">
      <div className="flex justify-around items-center h-full">
        {finalNavItems.map((item) => (
          <div key={item.label} className="flex-1">
            {"href" in item ? (
              <Link href={item.href} className="flex flex-col items-center justify-center h-full w-full">
                <item.icon
                  className={cn(
                    "h-6 w-6 mb-1 transition-colors",
                    location === item.href ? "text-primary" : "text-gray-500"
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    location === item.href ? "text-primary" : "text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <button
                onClick={item.action}
                className="flex flex-col items-center justify-center h-full w-full"
              >
                <item.icon className="h-6 w-6 mb-1 text-gray-500" />
                <span className="text-xs font-medium text-gray-500">
                  {item.label}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};