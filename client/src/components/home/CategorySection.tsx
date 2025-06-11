// src/components/sections/CategorySection.tsx

import { Link } from "wouter";
import { useCategories } from "@/lib/api";
import SpotlightCard from "@/pages/SpotlightCard"; // Adjust this path if needed

const CategorySection = () => {
  const { data: categories = [], isLoading } = useCategories();

  // Image URLs for each category
  const categoryImages = [
    "https://cdn.pixabay.com/photo/2016/03/27/22/16/fashion-1284496_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/01/16/15/01/fashion-601553_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/11/29/06/15/adult-1867743_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/11/19/15/40/clothes-1839935_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/07/31/18/18/wedding-869500_1280.jpg",
  ];

  if (isLoading) {
    // Skeleton loader for when data is fetching
    return (
      <div className="container mx-auto px-4 my-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Categories to Bag</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-neutral-800 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't render the section if there are no categories
  }

  return (
    <div className="container mx-auto px-4 my-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Categories to Bag</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {categories.slice(0, 6).map((category, index) => (
          // The Link now wraps the SpotlightCard to make the whole card clickable
          <Link key={category.id} href={`/category/${category.slug}`} className="group block">
            
            {/* SpotlightCard is used here, overriding default padding to make the image flush */}
            <SpotlightCard className="h-full !p-0">

              {/* Flex container to structure the image and text vertically */}
              <div className="flex flex-col h-full">
                
                {/* Image Container: Stays inside the card, takes full width */}
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={categoryImages[index % categoryImages.length]}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Text Container: Padded separately for spacing */}
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-neutral-200">{category.name}</h3>
                </div>

              </div>
            </SpotlightCard>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;