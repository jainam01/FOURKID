// src/components/home/OffersBanner.jsx (or your chosen path)
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

const OffersBanner = () => {
  const [, navigate] = useLocation();
  const [lightEffect, setLightEffect] = useState<'dim' | 'bright' | 'normal'>('normal'); 
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLightEffect(prev => {
        if (prev === 'normal') return 'bright';
        if (prev === 'bright') return 'dim';
        return 'normal';
      });
    }, 800); 
    
    return () => clearInterval(interval);
  }, []);
  
  const offers = [
    {
      code: "WELCOME2DQ",
      description: "15% OFF ON FIRST ORDER OVER Rs.8000",
      link: "/category/new-arrivals",
    },
    {
      code: "DESISTART",
      description: "Rs.800 OFF ON ORDERS OVER Rs.8000",
      link: "/category/featured",
    },
    {
      code: "ETHNICLOVE",
      description: "Rs.1200 OFF ON ORDERS OVER Rs.12000",
      link: "/category/suits",
    },
  ];

  // Light peach color (Tailwind doesn't have 'peach' by default, so using custom hex)
  // You can add this to your tailwind.config.js if you use it often.
  const peachColor = "bg-[#FFDAB9]"; // Example: PeachPuff
  const darkPeachColor = "bg-[#FFA07A]"; // Example: LightSalmon (for brighter state)

  // Function to get classes for the animated line with fade effect
  const getLineAnimationClasses = () => {
    if (lightEffect === 'bright') {
      // Line is fully visible and prominent (faded in)
      return `opacity-40 ${darkPeachColor}`; // Brighter peach, slightly less than full opacity for softness
    } else if (lightEffect === 'dim') {
      // Line is partially visible (partially faded)
      return `opacity-60 ${peachColor}`; 
    }
    // Normal state: line is faded out
    return `opacity-0 ${peachColor}`; 
  };
  
  return (
    <div className="container mx-auto px-4 my-8 md:my-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {offers.map((offer, index) => (
          <div 
            key={index}
            className="flex flex-col items-center justify-center text-center cursor-pointer p-6 md:p-8 rounded-xl hover:transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
            onClick={() => navigate(offer.link)}
          >
            {/* Offer Code container - made inline-block and relative */}
            <div 
              className="text-2xl sm:text-3xl font-bold mb-3 text-gray-700 relative inline-block py-1"
            >
              {/* The animated background line - extended width */}
              <span
                className={`
                  absolute top-1/2 -translate-y-1/2 
                  left-[-20%] right-[-20%] /* Extend 20% on both sides */
                  h-[85%] /* Adjust height to cover main part of text */
                  -z-10 rounded-sm 
                  transition-opacity duration-500 ease-out 
                  ${getLineAnimationClasses()}
                `}
              ></span>
              {/* Inner span to ensure text is above the background line if z-index issues arise, and to get accurate width for line extension logic if needed */}
              <span className="relative z-0">{offer.code}</span>
            </div>

            {/* Offer Description */}
            <div className="text-sm sm:text-base font-medium text-gray-600">
              {offer.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersBanner;