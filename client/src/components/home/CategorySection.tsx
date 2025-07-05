// src/components/sections/CategorySection.tsx

import { Link } from "wouter";
import { useCategories } from "@/lib/api";

const CategoryCard = ({ category, imageUrl }: { category: any; imageUrl:string }) => {
  return (
    // The group class on the Link is essential for the hover effects
    <Link 
      href={`/category/${category.slug}`}
      className="group block"
    >
      <div 
        className="
          flex items-center gap-4 p-4 
          bg-[#f8f9fa] dark:bg-neutral-800 
          rounded-md
          transition-all duration-300
          border border-transparent
          /* --- CHANGE: Hover effects are now prefixed with 'md:' --- */
          md:hover:shadow-lg md:hover:bg-white md:dark:hover:bg-neutral-700
          md:hover:border-neutral-200 md:dark:hover:border-neutral-600
        "
      >
        <div className="
          h-16 w-16 rounded-md overflow-hidden 
          flex-shrink-0 
          border-2 border-white dark:border-neutral-700 
          shadow-sm
        ">
          <img
            src={imageUrl}
            alt={category.name}
            className="
              w-full h-full object-cover 
              transition-transform duration-300 
              /* --- CHANGE: Scale effect is now desktop-only --- */
              md:group-hover:scale-110
            "
          />
        </div>
        
        <div className="inline-block relative">
          <h3 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">
            {category.name}
          </h3>
          {/* This is the underline element */}
          <span 
            className="
              absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary 
              transition-all duration-300 ease-in-out
              /* --- CHANGE: Underline effect is now desktop-only --- */
              md:group-hover:w-full
            "
          ></span>
        </div>
      </div>
    </Link>
  );
};


const CategorySection = () => {
  const { data: categories = [], isLoading } = useCategories();

  const categoryImages = [
    "https://cdn.pixabay.com/photo/2016/03/27/22/16/fashion-1284496_1280.jpg",
    "https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg",
    "https://res.cloudinary.com/dtpinwr0h/image/upload/v1751697622/ChatGPT_Image_Jul_5_2025_12_09_43_PM_lmo0l6.png",
    "https://cdn.pixabay.com/photo/2016/11/29/06/15/adult-1867743_1280.jpg",
    "https://cdn.pixabay.com/photo/2016/11/19/15/40/clothes-1839935_1280.jpg",
  ];

  if (isLoading) {
    // No changes needed in the skeleton loader
    return (
        <div className="container mx-auto px-4 my-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Explore Our collection</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-neutral-100 rounded-md animate-pulse">
                        <div className="h-16 w-16 rounded-md bg-neutral-300"></div>
                        <div className="h-6 w-32 bg-neutral-300 rounded-md"></div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="bg-white dark:bg-neutral-900 py-16">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-neutral-800 dark:text-neutral-200">
            Explore Our collection  
            </h2>

            {/* The Smart Grid Layout - no changes needed here */}
            <div className="
                grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6
                [&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:col-span-1
            ">
                {categories.slice(0, 5).map((category, index) => (
                    <CategoryCard 
                        key={category.id}
                        category={category}
                        imageUrl={categoryImages[index % categoryImages.length]}
                    />
                ))}
            </div>
        </div>
    </div>
  );
};

export default CategorySection;