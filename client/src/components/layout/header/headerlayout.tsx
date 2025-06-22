import { useState } from "react";
import Header from "./Header";
import { BottomNav } from "./BottomNav";
import { useMobile } from "@/hooks/use-mobile";
import Footer from "../footer/Footer";

interface HeaderLayoutProps {
  children: React.ReactNode;
}

export const HeaderLayout = ({ children }: HeaderLayoutProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const isMobile = useMobile();

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        // The Header component still needs to know about mobile state for its own internal logic
        // (like showing the mobile search overlay vs the desktop search input).
        isSearchVisible={isMobile && isSearchVisible}
        setIsSearchVisible={setIsSearchVisible}
      />

      <main className="flex-grow">
        {children}
      </main>

      {/* The desktop footer. It is correctly hidden on mobile devices. */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* --- THE CRITICAL FIX --- */}
      {/* We render BottomNav UNCONDITIONALLY. */}
      {/* Its own internal CSS class ('md:hidden') will handle showing/hiding it. */}
      {/* This removes the unreliable JavaScript check for rendering. */}
      <BottomNav onSearchClick={() => setIsSearchVisible(true)} />

      {/* 
        This spacer is still important. It adds empty space at the end of the page content
        so that the last items are not hidden underneath the fixed BottomNav on mobile.
        The 'md:hidden' class ensures it only exists on mobile.
      */}
      <div className="h-16 md:hidden" />
    </div>
  );
};