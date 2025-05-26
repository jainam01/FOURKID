// src/components/utils/ScrollToTop.tsx (or a similar utility location)
import { useEffect } from 'react';
import { useLocation } from 'wouter';

const ScrollToTop = () => {
  const [pathname] = useLocation(); // Get the current path

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top-left corner
  }, [pathname]); // Re-run effect when the pathname changes

  return null; // This component does not render anything
};

export default ScrollToTop;