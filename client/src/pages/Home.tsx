import React from "react";
import { Helmet } from "react-helmet-async";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategorySection from "@/components/home/CategorySection";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useProducts } from "@/lib/api";
// Using icons that visually align better with the reference image's style
// You will need to ensure you have these SVGs or find suitable Lucide React alternatives
// For demonstration, I'll use Lucide icons but style them to be simple and monochrome.
import { Award, ShieldCheck, ShoppingBag, Truck } from "lucide-react"; // Examples
import OffersBanner from "@/components/home/offerbanner";
import Newsletter from "@/components/home/Newsletter";
// import ShopByAgeSection from '@/components/home/ShopByAgeSection';
import RetailerReviewSection from "@/components/home/RetailerReviewSection";
import CategoryShowcase from "@/components/home/CategoryShowcase";

const Home = () => {
  const { data: productsResponse } = useProducts();
  const products = productsResponse || [];
  const featuredProducts = products;

  // Placeholder SVGs (replace with your actual SVGs if you have them)
  // These are simplified representations.
  const MadeInIndiaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-3 text-black">
      <path d="M1.48104 7.99999C1.48104 7.99999 1.48104 7.99999 1.48104 7.99999C1.48104 7.44771 1.92875 6.99999 2.48104 6.99999L3.48104 6.99999L3.48104 8.99999L20.481 8.99999L20.481 6.99999H21.481C22.0333 6.99999 22.481 7.44771 22.481 7.99999V17.9999C22.481 18.5522 22.0333 18.9999 21.481 18.9999H2.48104C1.92875 18.9999 1.48104 18.5522 1.48104 17.9999L1.48104 7.99999Z"/>
      <path d="M5 10L5 12"/> <path d="M7 10L7 12"/> <path d="M9 10L9 12"/> <path d="M11 10L11 12"/>
      <path d="M13 10L13 12"/> <path d="M15 10L15 12"/> <path d="M17 10L17 12"/> <path d="M19 10L19 12"/>
      <circle cx="12" cy="15" r="1.5"/>
    </svg>

  );
  const AssuredQualityIcon = () => <ShieldCheck className="h-8 w-8 mr-3 text-black" />; // Lucide as placeholder
  const TrendyDesignsIcon = () => <ShoppingBag className="h-8 w-8 mr-3 text-black" />; // Lucide as placeholder


  return (
    <>
      <Helmet>
        <title>Fourkids - Wholesale Indian Clothing</title>
        <meta name="description" content="Fourkids is a premium wholesale clothing business for Indian market offering high quality trendy designs at competitive prices." />
      </Helmet>

      {/* Row 1: Promotional Banners (TIGHT DESIGN) */}
      <div className="bg-[#b5e3d8] text-black m-2.5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center py-3 text-center">
            <div className="flex-1 pb-3 md:pb-0">
              <p className="text-2xl md:text-2xl text-base font-bold mb-0 md:mb-1 text-[#232323] uppercase">FREE SHIPPING ACROSS USA</p>
              <p className="text-base md:text-base text-xs leading-[22px] text-[#3c3c  3c] mb-0">Enjoy free shipping on all orders</p>
            </div>
            <div className="hidden md:block w-px h-14 bg-[#232323]/20 mx-8"></div>
            <div className="flex-1">
              <p className="text-2xl md:text-2xl text-base font-bold mb-0 md:mb-1 text-[#232323] uppercase">UNBEATABLE INTERNATIONAL PRICE</p>
              <p className="text-base md:text-base text-xs leading-[22px] text-[#3c3c3c] mb-0">Shop trendy picks at best lowest prices!</p>
            </div>
          </div>
        </div>
      </div>
      

      {/* Row 2: Value Proposition Banners (COMPACT DESIGN) */}
      {/* <div className="container mx-auto px-4 my-8 md:my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 items-stretch text-center border-t border-b border-gray-200">
          <div className="flex items-center justify-center py-3 px-4 md:border-r md:border-gray-200">
            <MadeInIndiaIcon /> 
            <p className="text-sm font-bold text-black uppercase tracking-wide">MADE IN INDIA</p>
          </div>
          <div className="w-3/4 mx-auto h-px bg-gray-200 my-3 md:hidden"></div>
          
          <div className="flex items-center justify-center py-3 px-4 md:border-r md:border-gray-200">
            <AssuredQualityIcon />
            <p className="text-sm font-bold text-black uppercase tracking-wide">ASSURED QUALITY</p>
          </div>
          <div className="w-3/4 mx-auto h-px bg-gray-200 my-3 md:hidden"></div>

          <div className="flex items-center justify-center py-3 px-4">
            <TrendyDesignsIcon />
            <p className="text-sm font-bold text-black uppercase tracking-wide">TRENDY DESIGNS</p>
          </div>
        </div>
      </div> */}


      <HeroCarousel />
      <CategorySection />
      <OffersBanner />
      <CategoryShowcase />
      {/* <ShopByAgeSection /> */}
    
      <div className="container mx-auto px-4 my-12 md:my-16">
        <ProductGrid products={featuredProducts} title="Featured Products" />
      </div>

      <RetailerReviewSection />

      {/* why choose fourkids component */}
      {/* <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Fourkids?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Fourkids is a leading wholesale clothing brand in India, offering a wide range of
              trendy and high-quality garments at competitive prices. We pride ourselves on
              providing exceptional customer service, timely delivery, and consistent quality
              that keeps our partners coming back.
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Our designs are created with the latest fashion trends in mind, ensuring your
              inventory stays fresh and appealing to your customers. With Fourkids as your
              wholesale partner, you'll have access to exclusive collections that set your
              business apart from the competition.
            </p>
          </div>
        </div>
      </div> */}

{/* 
      <Newsletter /> */}

      {/* become partner */}
      {/* <div className="bg-primary text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Become a Partner of Fourkids</h2>
          <p className="max-w-2xl mx-auto mb-8 leading-relaxed">
            Join our growing network of wholesale partners and take your business to the next level.
            Enjoy exclusive benefits, promotional support, and access to our complete product range.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Register Now</Link>
          </Button>
        </div>
      </div> */}
      
    </>
  );
};

export default Home;