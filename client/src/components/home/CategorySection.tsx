import { Link } from "wouter";
import { useCategories } from "@/lib/api";
import { ShoppingBag } from "lucide-react";

const CategorySection = () => {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 my-12">
        <h2 className="text-2xl font-bold mb-8 text-center">Categories to Bag</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  // Image URLs for each category (assuming we have 6 main categories)
  const categoryImages = [
    "https://pixabay.com/get/g1cc8b0033fa33abebe190020927f8d9389ac08bdc4c1e49deba8848ea862221fd10955450ca6600da20146b097232bb34d9184979696ced75f95863ef73b47ac_1280.jpg",
    "https://pixabay.com/get/g9432b4e984217bded52ca3650f4c11902771885f65ad9e75dd9584e62148a8fa3ec1f2fce092671cbd44264a1f60b41db3396a3aea0bf6985a3a1e701b128016_1280.jpg",
    "https://pixabay.com/get/ga74d3f2a0ffa67dd6fb6ba50c9179cf1cc51f81722ed90a33b6ac423d3485425a1385427f9577ab213e2677473e30138c95f00f8e5bbf890209cfed2c62dd682_1280.jpg",
    "https://pixabay.com/get/gdeaab8d36c750a009cf099d761473ecad5db3a4b8c98861318e9ffa0883db332ce9023656c1e3eaa9d3dddf71b4a98120011d5cd9286b4aac54277a083dc70bc_1280.jpg",
    "https://pixabay.com/get/g71ed68b30ace3ed78b296cdd59212d9e2d60d335e8095415b18f08e0131d6d0144f366132afe2048afdbc79fa27ba647b2303115cd63599e4773a3fd26e7d332_1280.jpg",
    "https://pixabay.com/get/g0318c25cc99f0b81c61cea1e9456dd6fd7a77f3afe494cde60b5345b2ba72ce7b0de29e395b12a6d29ee60fedf4c6623034398a75b19b7e58a1d4a2008882261_1280.jpg"
  ];

  return (
    <div className="container mx-auto px-4 my-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Categories to Bag</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((category, index) => (
          <Link key={category.id} href={`/category/${category.slug}`}>
            <div className="group cursor-pointer">
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={categoryImages[index % categoryImages.length]}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 p-2 rounded-full">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-center font-semibold">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
