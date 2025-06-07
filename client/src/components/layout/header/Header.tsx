import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useLogout, isAdmin } from "@/lib/auth";
import { useCategories } from "@/lib/api";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/api";
import { useWatchlist } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Used for mobile search overlay
  const [, navigate] = useLocation();
  const { data: user } = useUser();
  const logout = useLogout();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const { data: cartItems = [] } = useCart();
  const { data: watchlistItems = [] } = useWatchlist(); // Watchlist data
  const isMobile = useMobile();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search query after navigation
      if (isMobile) {
        setIsSearchVisible(false); // Close mobile search overlay
      }
    }
  };

  // Close mobile search if screen resizes to desktop
  useEffect(() => {
    if (!isMobile && isSearchVisible) {
      setIsSearchVisible(false);
    }
  }, [isMobile, isSearchVisible]);

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      {/* First Header (Top Bar) */}
      <div className="container mx-auto h-16 px-4 flex items-center justify-between relative border-b border-gray-200">
        {/* Left Section: Mobile Menu Trigger and Desktop Links */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] pt-10 p-6">
                <div className="flex flex-col space-y-2">
                  <SheetClose asChild><Link href="/support" className="text-base font-medium hover:text-primary py-2">Support</Link></SheetClose>
                  <SheetClose asChild><Link href="/wholesale-program" className="text-base font-medium hover:text-primary py-2">Wholesale Program</Link></SheetClose>
                  <SheetClose asChild><Link href="/about" className="text-base font-medium hover:text-primary py-2">About Us</Link></SheetClose>

                  {categories.length > 0 && <div className="border-t my-3"></div>}
                  {categories.length > 0 && <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2 pb-1">Categories</p>}
                  {categories.map((category) => (
                    <SheetClose key={category.id} asChild>
                      <Link href={`/category/${category.slug}`} className="text-base font-medium hover:text-primary py-2">{category.name}</Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
          {/* Desktop Left Links */}
          <div className="hidden md:flex items-center space-x-5 text-sm">
            <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
            <Link href="/wholesale-program" className="hover:text-primary transition-colors">Wholesale Program</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          </div>
        </div>

        {/* Middle - Logo (Absolutely Centered) */}
        {!(isMobile && isSearchVisible) && ( // Hide logo if mobile search is active to prevent overlap
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <h1 className="text-3xl font-bold text-primary">Fourkids</h1>
            </Link>
          </div>
        )}


        {/* Right Section: Search, User, Watchlist, Cart */}
        {/* Hide icons if mobile search is active, they are not needed then */}
        {!(isMobile && isSearchVisible) && (
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Search Form */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative" id="desktopSearchForm">
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-32 sm:w-40 lg:w-48 pr-10 rounded-md border-gray-300 focus:border-primary focus:ring-0 focus:ring-offset-0"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-100 rounded focus:outline-none"
                style={{ background: "none", border: "none" }}
                tabIndex={-1}
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            {/* Mobile Search Icon (triggers overlay search) */}
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(true)} className="h-9 w-9">
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* User Account Icon */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/orders">Order History</Link></DropdownMenuItem>
                  {isAdmin(user) && (<DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>)}
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                <Link href="/login"><User className="h-5 w-5" /></Link>
              </Button>
            )}

            {/* Watchlist Icon (no count as per image) */}
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link href="/watchlist"><Heart className="h-5 w-5" /></Link>
            </Button>

            {/* Cart Icon (with count, even if 0) */}
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link href="/cart">
                <div className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartItems && ( // Ensure cartItems is available
                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-medium rounded-full h-[18px] w-[18px] flex items-center justify-center leading-none">
                      {cartItems.length}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
          </div>
        )}

        {/* Mobile Full-width Search Bar Overlay */}
        {isMobile && isSearchVisible && (
          <div className="absolute left-0 right-0 top-0 w-full h-16 p-2 bg-background border-b border-gray-200 shadow-lg z-20 flex items-center space-x-2">
            <form onSubmit={handleSearch} className="flex-grow flex">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none flex-grow h-10 border-gray-300 focus:border-primary focus:ring-0"
                autoFocus
              />
              <Button type="submit" variant="default" size="icon" className="rounded-l-none h-10 w-10 bg-primary hover:bg-primary/90">
                <Search className="h-5 w-5 text-white" />
              </Button>
            </form>
            <Button type="button" variant="ghost" size="icon" onClick={() => setIsSearchVisible(false)} className="h-10 w-10 flex-shrink-0">
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Second Header (Navigation Bar) */}
      <nav className="bg-black text-white hidden md:block"> {/* Hide on mobile as categories are in sheet */}
      <div className="container mx-auto px-4">
          <ul className="flex justify-center items-center space-x-5 lg:space-x-7">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-block relative font-semibold py-3 group text-sm uppercase tracking-wide hover:text-gray-300 transition-colors duration-200" // MODIFIED HERE
                >
                  {category.name}
                  {/* This span is for the moving underline effect */}
                  <span className="absolute bottom-2 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;