// Updated Header with Improved Mobile Search UX
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useLogout, isAdmin } from "@/lib/auth";
import { useCategories, useCart, useProducts } from "@/lib/api";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  Phone,
  HelpCircle,
  Building2,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
import { Separator } from "@/components/ui/separator";

interface HeaderProps {
  isSearchVisible: boolean;
  setIsSearchVisible: (visible: boolean) => void;
}

const Header = ({ isSearchVisible, setIsSearchVisible }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const { data: user } = useUser();
  const logout = useLogout();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const { data: cartItems = [] } = useCart();
  const { data: products = [] } = useProducts();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      toast({ title: "Logged out" });
      navigate("/");
    } catch (error) {
      toast({ title: "Error", description: "Failed to log out.", variant: "destructive" });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const search = searchQuery.trim().toLowerCase();
    const product = products.find(p => p.name.toLowerCase().includes(search));
    if (product) {
      navigate(`/product/${product.id}`);
      setSearchQuery("");
      setIsSearchVisible(false);
      return;
    }
    const category = categories.find(c => c.name.toLowerCase().includes(search));
    if (category) {
      navigate(`/category/${category.slug}`);
      setSearchQuery("");
      setIsSearchVisible(false);
      return;
    }
    toast({ title: "No product or category found", description: "Please try a different search term." });
  };

  const HeaderContent = () => (
    <div className="container mx-auto h-16 px-4 flex items-center justify-between relative">
      <div className="flex items-center space-x-2 md:flex-1 md:justify-start">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 flex flex-col bg-background">
            <div className="p-4 border-b flex justify-between items-center">
              {user ? (
                <Link href="/profile" className="flex items-center space-x-3 group">
                  <div className="w-11 h-11 rounded-md bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <span className="font-bold text-lg">{user.name}</span>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <h2 className="text-2xl font-bold text-primary">Fourkids</h2>
              )}
            </div>
            <div className="flex-grow overflow-y-auto px-4 py-2">
              <div className="flex flex-col space-y-1 text-base font-medium">
                {!user && (
                  <>
                    <SheetClose asChild>
                      <Button asChild className="w-full text-primary font-bold my-2" variant="outline"><Link href="/login">LOGIN / SIGNUP</Link></Button>
                    </SheetClose>
                    <Separator className="my-4" />
                  </>
                )}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2 pb-1 px-2">CATEGORIES</p>
                {categories.map((category) => (
                  <SheetClose key={category.id} asChild>
                    <Link href={`/category/${category.slug}`} className="flex justify-between items-center py-3 px-2 hover:bg-accent rounded-md">
                      {category.name}
                    </Link>
                  </SheetClose>
                ))}
                <Separator className="my-4" />
                <SheetClose asChild><Link href="/contact" className="flex items-center gap-4 py-3 px-2 hover:bg-accent rounded-md"><Phone className="mr-3 h-5 w-5"/>Contact Us</Link></SheetClose>
                <SheetClose asChild><Link href="/faq" className="flex items-center gap-4 py-3 px-2 hover:bg-accent rounded-md"><HelpCircle className="mr-3 h-5 w-5"/>FAQs</Link></SheetClose>
                <SheetClose asChild><Link href="/wholesale-program" className="flex items-center gap-4 py-3 px-2 hover:bg-accent rounded-md"><Building2 className="mr-3 h-5 w-5"/>Wholesale</Link></SheetClose>
                <SheetClose asChild><Link href="/about" className="flex items-center gap-4 py-3 px-2 hover:bg-accent rounded-md"><Info className="mr-3 h-5 w-5"/>About Us</Link></SheetClose>
                {user && (
                  <SheetClose asChild>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-4 py-3 px-2 hover:bg-accent rounded-md text-base font-medium">
                      <LogOut className="mr-3 h-5 w-5" /> Logout
                    </button>
                  </SheetClose>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center space-x-7 text-sm font-semibold">
          <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
          <Link href="/wholesale-program" className="hover:text-primary transition-colors">Wholesale Program</Link>
        </div>
      </div>

      <div className="md:absolute md:left-1/2 md:top-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2">
        <Link href="/">
          <h1 className="text-3xl font-bold text-primary">Fourkids</h1>
        </Link>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-2 md:flex-1 justify-end">
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
          <Input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-48 pr-10"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500">
            <Search className="h-4 w-4" />
          </button>
        </form>
        {user ? (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="hidden md:inline-flex h-9 w-9"><User className="h-5 w-5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href="/profile">My Profile</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/orders">Order History</Link></DropdownMenuItem>{isAdmin(user) && (<DropdownMenuItem asChild><Link href="/admin">Admin Dashboard</Link></DropdownMenuItem>)}<DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem></DropdownMenuContent></DropdownMenu>) : (<Button variant="ghost" size="icon" asChild className="hidden md:inline-flex h-9 w-9"><Link href="/login"><User className="h-5 w-5" /></Link></Button>)}
        <Button variant="ghost" size="icon" asChild className="h-9 w-9"><Link href="/watchlist"><Heart className="h-5 w-5" /></Link></Button>
        <Button variant="ghost" size="icon" asChild className="h-9 w-9"><Link href="/cart"><div className="relative"><ShoppingBag className="h-5 w-5" />{cartItems && cartItems.length > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartItems.length}</span>)}</div></Link></Button>
      </div>
    </div>
  );

  const SearchOverlay = () => (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 p-4 border-b shadow-md">
      <form onSubmit={handleSearch} className="flex items-center w-full">
        <Input
          type="text"
          placeholder="Search for products or categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow rounded-l-md h-10"
          autoFocus
        />
        <Button type="submit" variant="default" size="sm" className="rounded-l-none h-10">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={() => setIsSearchVisible(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm shadow-sm flex flex-col">
      <div className="relative border-b">
        {isSearchVisible ? <SearchOverlay /> : <HeaderContent />}
      </div>
      <div className="hidden md:flex w-full h-12 items-center justify-center space-x-8 bg-black">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="text-sm font-bold text-white uppercase transition-colors hover:text-primary"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
