// src/components/HeroCarousel.tsx

import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/lib/api";
import useEmblaCarousel from 'embla-carousel-react'; 

const HeroCarousel = () => {
  const { data: banners = [], isLoading } = useBanners("hero");

  // --- 2. Setup Embla Carousel ---
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- 3. Update navigation functions to use the Embla API ---
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // --- Update selected dot on scroll/swipe ---
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect(); // Set initial state
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  // --- Auto-play ---
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000); // 5 seconds
    return () => clearInterval(autoplay);
  }, [emblaApi]);


  if (isLoading) {
    return (
      <div className="w-full h-[550px] lg:h-[600px] bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading banner...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[550px] lg:h-[600px] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Fourkids</h2>
          <p className="text-gray-600 mb-6">Premium wholesale clothing for the Indian market</p>
          <Button asChild><Link href="/shop">Shop Now</Link></Button>
        </div>
      </div>
    );
  }

  return (
    // --- CHANGE: Controlled, responsive height ---
    <div className="relative w-full h-[550px] lg:h-[600px] overflow-hidden" ref={emblaRef}>
      {/* --- 4. New structure for Embla --- */}
      <div className="flex h-full">
        {banners.map((banner) => (
          // Each slide is now a flex item
          <div key={banner.id} className="relative flex-shrink-0 flex-grow-0 w-full h-full">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="container mx-auto px-6 md:px-12 text-center md:text-left">
                <div className="max-w-lg md:max-w-xl mx-auto md:mx-0">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-lg text-white mb-6 drop-shadow-md">
                      {banner.description}
                    </p>
                  )}
                  <Button size="lg" asChild>
                    <Link href={banner.link || "/shop"}>SHOP NOW</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CHANGE: Arrows are now hidden on mobile --- */}
      {banners.length > 1 && (
        <>
          <button
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 text-white rounded-full h-12 w-12 hidden md:inline-flex items-center justify-center transition-colors"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/60 text-white rounded-full h-12 w-12 hidden md:inline-flex items-center justify-center transition-colors"
            onClick={scrollNext}
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      {/* Dots (now use the Embla API) */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex ? "bg-white scale-110" : "bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;