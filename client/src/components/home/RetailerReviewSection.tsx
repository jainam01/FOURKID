// src/components/sections/RetailerReviewSection.tsx

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote, ArrowLeft, ArrowRight } from 'lucide-react';

// --- DUMMY DATA: Replace this with data from your API or a static list ---
const reviews = [
  {
    name: "Sneha Patel",
    company: "Owner, Little Wonders – Ahmedabad",
    avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 5,
    reviewText: "We’ve been sourcing from Fourkids for over 2 years now. Their capris and tops sell like hotcakes! Our repeat customers specifically ask for Fourkids stock. Loved the new summer collection – vibrant and comfy!"
  },
  {
    name: "Amit Verma",
    company: "Retail Partner, BabyZone – Lucknow",
    avatarUrl: "https://randomuser.me/api/portraits/men/52.jpg",
    rating: 5,
    reviewText: "Fourkids is a blessing for mid-tier retailers like us. Their stock rotation is quick, prices are competitive, and the margins are good. Most importantly, we never have to worry about quality returns!"
  },
  {
    name: "Neha Jain",
    company: "Founder, KidsKart – Jaipur",
    avatarUrl: "https://randomuser.me/api/portraits/women/55.jpg",
    rating: 4,
    reviewText: "Loved their cotton collections and ethnic festive wear for toddlers. Packaging is neat, dispatch is usually on time. Just hoping they expand their collection in newborn wear too."
  },
  {
    name: "Rakesh Bansal",
    company: "Distributor, Bachpan Bazaar – Delhi NCR",
    avatarUrl: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 5,
    reviewText: "I supply to over 20 retailers, and almost all prefer Fourkids for their reliability and fit. What really stands out is how trendy their designs are, even in small towns."
  },
  {
    name: "Pooja Desai",
    company: "Manager, BabyNest Store – Surat",
    avatarUrl: "https://randomuser.me/api/portraits/women/41.jpg",
    rating: 4,
    reviewText: "Fourkids gives a good mix of stylish and traditional. Delivery timelines are mostly fine, and the support team is responsive. Would love to see more matching sets and baby accessories soon."
  },
  {
    name: "Rahul Shetty",
    company: "Owner, Tiny Tails – Bengaluru",
    avatarUrl: "https://randomuser.me/api/portraits/men/44.jpg",
    rating: 5,
    reviewText: "As someone who runs a boutique kids’ store, I need consistency. Fourkids delivers exactly that – consistent quality, clear sizing, and excellent support. Keep up the great work!"
  },
  {
    name: "Ishita Gupta",
    company: "Co-Founder, Tots & Trends – Chandigarh",
    avatarUrl: "https://randomuser.me/api/portraits/women/30.jpg",
    rating: 5,
    reviewText: "My team and I love working with Fourkids. The ordering system is simple, and the stock is always fresh. Plus, the customer care team really listens to feedback. That’s rare these days!"
  }
];


// --- A helper component for star ratings ---
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1 text-yellow-500">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} fill={i < rating ? 'currentColor' : 'none'} />
    ))}
  </div>
);

// --- The Main Component ---
const RetailerReviewSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect) };
  }, [emblaApi]);

  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
            What Our Retailers Say
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Trusted by growing businesses for quality, style, and reliability.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {reviews.map((review, index) => (
                <div key={index} className="flex-grow-0 flex-shrink-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4">
                  <Card className="h-full flex flex-col bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-6 flex-grow flex flex-col justify-between relative">
                      <Quote className="absolute top-4 right-4 h-16 w-16 text-slate-100 dark:text-slate-700" />
                      <div className="z-10">
                        <div className="flex items-center mb-4">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={review.avatarUrl} alt={review.name} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{review.name}</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{review.company}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                        <blockquote className="mt-4 text-slate-700 dark:text-slate-300 border-l-4 border-primary pl-4 italic">
                          {review.reviewText}
                        </blockquote>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full p-2 shadow-md hover:bg-slate-100 transition-colors hidden lg:flex">
            <ArrowLeft size={24} />
          </button>
          <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full p-2 shadow-md hover:bg-slate-100 transition-colors hidden lg:flex">
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
                <button 
                    key={index}
                    onClick={() => emblaApi?.scrollTo(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${selectedIndex === index ? 'bg-primary w-6' : 'bg-slate-300 dark:bg-slate-600'}`}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default RetailerReviewSection;