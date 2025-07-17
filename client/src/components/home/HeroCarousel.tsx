import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/lib/api";
import useEmblaCarousel from 'embla-carousel-react'; 

const HeroCarousel = () => {
  const { data: banners = [], isLoading } = useBanners("hero");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 10000);
    return () => clearInterval(autoplay);
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] md:h-[550px] lg:h-[600px] bg-slate-200 animate-pulse flex items-center justify-center">
        <p className="text-slate-400">Loading Banners...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[60vh] md:h-[550px] lg:h-[600px] bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Fourkids</h2>
          <p className="text-slate-600 mb-6">Premium wholesale clothing for children.</p>
          <Button asChild><Link href="/shop">Shop Now</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[60vh] md:h-[550px] lg:h-[600px] overflow-hidden bg-slate-800" ref={emblaRef}>
      <div className="flex h-full">
        {banners.map((banner) => (
          <div key={banner.id} className="relative flex-shrink-0 flex-grow-0 w-full h-full">
            
            {/* Desktop Image: Hidden by default, becomes visible on medium screens and up. */}
            <img
              src={banner.desktopImage}
              alt={banner.title}
              className="hidden md:block w-full h-full object-cover object-center"
            />
            
            {/* Mobile Image: Visible by default, becomes hidden on medium screens and up. */}
            <img
              src={banner.mobileImage}
              alt={banner.title}
              className="block md:hidden w-full h-full object-cover object-center"
            />
            
            {/* --- KEY CHANGE #1: HIDE TEXT ON MOBILE --- */}
            {/* This entire div is now hidden on mobile and appears as a flex container on desktop */}
            <div className="absolute inset-0 hidden md:flex items-center justify-center text-center">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="relative container mx-auto px-6">
                <div className="max-w-xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-lg text-white mb-6 drop-shadow-md">
                      {banner.description}
                    </p>
                  )}
                  {banner.link && (
                    <Button size="lg" asChild>
                      <Link href={banner.link}>SHOP NOW</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- KEY CHANGE #2: SHOW DOTS ON MOBILE --- */}
      {/* Navigation arrows remain hidden on mobile, but dots are now visible */}
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
        </>
      )}
    </div>
  );
};

export default HeroCarousel;