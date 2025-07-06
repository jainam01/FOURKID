import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBanners } from "@/lib/api";

const HeroCarousel = () => {
  const { data: banners = [], isLoading } = useBanners("hero");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[80vh] bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading banner...</p>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-[80vh] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Fourkids</h2>
          <p className="text-gray-600 mb-6">Premium wholesale clothing for the Indian market</p>
          <Button asChild>
            <Link href="/category/capri">Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[80vh] sm:h-[100vh] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{ zIndex: index === currentSlide ? 10 : 0 }}
          >
            {/* Full Background Image */}
            <img
              loading="lazy"
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay with Text */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-lg text-white mb-6 drop-shadow-md">
                      {banner.description}
                    </p>
                  )}
                  <Button size="lg" asChild>
                    <Link href={banner.link || "/category/capri"}>SHOP NOW</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            aria-label="Previous Slide"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-gray-800 rounded-full h-10 w-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            aria-label="Next Slide"
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 text-gray-800 rounded-full h-10 w-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
