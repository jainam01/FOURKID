// File: client/src/components/CategoryShowcase.tsx

import React, { useState } from "react";
import { Link } from "wouter";

import { useCategories, useProductsByCategorySlug } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import ProductQuickView from "@/components/products/QuickViewModal"; // You will need this modal component
import ProductCard from "@/components/products/ProductCard"; // <-- IMPORTING YOUR NEW CARD

import { ProductWithDetails } from "@shared/schema";

// --- PARENT COMPONENT: MANAGES QUICK VIEW STATE ---
const CategoryShowcase = () => {
  const { data: categories, isLoading, error } = useCategories();
  
  // State for the Quick View modal is held here, in the highest-level component
  const [quickViewProduct, setQuickViewProduct] = useState<ProductWithDetails | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-12 py-8">
        <CategoryRowSkeleton />
        <CategoryRowSkeleton />
      </div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-destructive">Failed to load categories.</div>;
  }

  return (
    <>
      <div className="container mx-auto space-y-12 py-8">
        {categories?.map((category) => (
          // Pass down the function that allows child components to open the modal
          <CategoryRow key={category.id} category={category} onQuickView={setQuickViewProduct} />
        ))}
      </div>

      {/* 
        The Quick View Modal. 
        It's only rendered when 'quickViewProduct' is not null.
        This fixes the TypeScript error.
      */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={true}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};

// --- CATEGORY ROW COMPONENT ---
interface CategoryRowProps {
  category: { id: number; name: string; slug: string; description: string | null };
  onQuickView: (product: ProductWithDetails) => void; // Expects the function from the parent
}

const CategoryRow = ({ category, onQuickView }: CategoryRowProps) => {
  const { data: products, isLoading } = useProductsByCategorySlug(category.slug);
  const hasMoreProducts = (products?.length ?? 0) > 4;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{category.name}</h2>
        {hasMoreProducts && (
          <Button asChild variant="outline">
            <Link href={`/category/${category.slug}`}>Show All</Link>
          </Button>
        )}
      </div>

      {isLoading ? (
        <ProductCarouselSkeleton />
      ) : !products || products.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">No products found in this category.</div>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 pl-4">
                {/* 
                  Render your new ProductCard and pass the onQuickView function to it.
                  This is the key integration point.
                */}
                <ProductCard product={product} onQuickView={onQuickView} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {hasMoreProducts && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
      )}
    </section>
  );
};


// --- SKELETON COMPONENTS FOR LOADING STATE ---
const CategoryRowSkeleton = () => (
  <section>
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-24" />
    </div>
    <ProductCarouselSkeleton />
  </section>
);

const ProductCarouselSkeleton = () => (
    <div className="flex space-x-4">
        {[...Array(4)].map((_, i) => (
             <div key={i} className="flex-shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        ))}
    </div>
);


export default CategoryShowcase;