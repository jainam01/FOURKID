import { useState, useEffect } from "react";

// The standard Tailwind 'md' breakpoint.
const MOBILE_BREAKPOINT = 768;

/**
 * A robust hook to determine if the viewport is mobile-sized.
 * This hook is safe for Server-Side Rendering (SSR) and avoids hydration mismatches
 * by waiting for the component to mount on the client before checking the window size.
 */
export function useMobile() {
  // 1. Start with a definite 'false' value. This is the crucial first step.
  //    This ensures the server render (if any) and the initial client render match.
  const [isMobile, setIsMobile] = useState(false);

  // 2. The useEffect hook will only run ONCE on the client, after the component has mounted.
  useEffect(() => {
    // This function checks the media query and updates the state.
    const checkDevice = () => {
      setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches);
    };

    // 3. Run the check immediately upon mounting.
    checkDevice();

    // 4. Add a listener to update the state whenever the viewport size crosses the breakpoint.
    window.addEventListener("resize", checkDevice);

    // 5. Cleanup: Remove the listener when the component unmounts to prevent memory leaks.
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  return isMobile;
}

// Export with the alternative name for compatibility.
export const useIsMobile = useMobile;