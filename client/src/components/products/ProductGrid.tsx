import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { ProductWithDetails } from "@shared/schema";

interface ProductGridProps {
  products: ProductWithDetails[];
  title?: string;
  emptyMessage?: string;
}

const ProductGrid = ({ 
  products, 
  title, 
  emptyMessage = "No products found." 
}: ProductGridProps) => {
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithDetails | null>(null);

  const handleQuickView = (product: ProductWithDetails) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      {products.length === 0 ? (
        <div className="flex justify-center items-center py-16 text-gray-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onQuickView={handleQuickView} 
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          isOpen={!!quickViewProduct} 
          onClose={closeQuickView} 
        />
      )}
    </div>
  );
};

export default ProductGrid;
