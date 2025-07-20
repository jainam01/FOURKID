import { useState, useMemo } from "react"; // Import useMemo
import { useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { useProductsByCategorySlug, useCategoryBySlug } from "@/lib/api";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductWithDetails } from "@shared/schema";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetClose, // Import SheetClose
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMobile } from "@/hooks/use-mobile";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SortOption = "newest" | "price-asc" | "price-desc";

// Constants for "All" select item values to avoid empty strings
const ALL_PRICES_VALUE = "all-prices";
const ALL_SIZES_VALUE = "all-sizes";
const ALL_COLORS_VALUE = "all-colors";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsByCategorySlug(slug);
  const { data: category, isLoading: isLoadingCategory } = useCategoryBySlug(slug);

  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const isMobile = useMobile();

  const { sizeOptions, colorOptions, priceStats } = useMemo(() => {
    const variants = {
      sizes: new Set<string>(),
      colors: new Set<string>(),
    };
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach(product => {
      minPrice = Math.min(minPrice, product.price);
      maxPrice = Math.max(maxPrice, product.price);
      product.variants?.forEach(variant => {
        if (variant.name.toLowerCase() === 'size' && variant.value && typeof variant.value === 'string') {
          variants.sizes.add(variant.value);
        } else if (variant.name.toLowerCase() === 'color' && variant.value && typeof variant.value === 'string') {
          variants.colors.add(variant.value);
        }
      });
    });

    return {
      sizeOptions: Array.from(variants.sizes).sort(),
      colorOptions: Array.from(variants.colors).sort(),
      priceStats: { min: minPrice, max: maxPrice === 0 && minPrice === Infinity ? 0 : maxPrice }, // handle no products case for maxPrice
    };
  }, [products]);

  const sortedAndFilteredProducts = useMemo(() => {
    let result: ProductWithDetails[] = [...products];

    if (priceRange) {
      result = result.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    if (selectedSizes.length > 0) {
      result = result.filter(product =>
        product.variants?.some(
          variant =>
            variant.name.toLowerCase() === 'size' && selectedSizes.includes(variant.value)
        )
      );
    }

    if (selectedColors.length > 0) {
      result = result.filter(product =>
        product.variants?.some(
          variant =>
            variant.name.toLowerCase() === 'color' && selectedColors.includes(variant.value)
        )
      );
    }

    return result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [products, sortOption, priceRange, selectedSizes, selectedColors]);

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(null);
    setSortOption("newest");
  };
  
  const isLoading = isLoadingProducts || isLoadingCategory;

  // Helper to generate display string for price ranges
  const formatPriceDisplay = (min: number, max: number): string => `₹${min.toFixed(2)} - ₹${max.toFixed(2)}`;
  // Helper to generate value string for price range select items
  const formatPriceValue = (min: number, max: number): string => `${min}-${max}`;
  
  const priceSelectOptions = useMemo(() => {
    if (priceStats.min === Infinity || priceStats.max === 0 || priceStats.min === priceStats.max) return [];
    const third = (priceStats.max - priceStats.min) / 3;
    return [
      { value: formatPriceValue(priceStats.min, priceStats.min + third), label: formatPriceDisplay(priceStats.min, priceStats.min + third) },
      { value: formatPriceValue(priceStats.min + third, priceStats.min + 2 * third), label: formatPriceDisplay(priceStats.min + third, priceStats.min + 2 * third) },
      { value: formatPriceValue(priceStats.min + 2 * third, priceStats.max), label: formatPriceDisplay(priceStats.min + 2 * third, priceStats.max) },
    ].filter(opt => parseFloat(opt.value.split('-')[0]) < parseFloat(opt.value.split('-')[1])); // Ensure min < max for options
  }, [priceStats.min, priceStats.max]);


  let productGridEmptyMessage = `No products found in ${category?.name || 'this category'}.`;
  if (selectedSizes.length > 0 || selectedColors.length > 0 || priceRange) {
    productGridEmptyMessage += " with the selected filters";
  } else if (products.length > 0 && sortedAndFilteredProducts.length === 0) {
     // This case should ideally not happen if no filters are active unless sorting removed items
     productGridEmptyMessage = `No products currently match the criteria in ${category?.name || 'this category'}.`;
  }


  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} - Fourkids Wholesale` : 'Category - Fourkids Wholesale'}</title>
        <meta 
          name="description" 
          content={category?.description || 'Browse our wholesale clothing collection. High quality products at competitive prices.'}
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="min-h-[400px] flex justify-center items-center">
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{category?.name || 'Products'}</h1>
              {category?.description && (
                <p className="text-gray-600 mt-2">{category.description}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="flex items-center gap-2">
                {isMobile ? (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                      <SheetHeader>
                        <SheetTitle>Filter Products</SheetTitle>
                        <SheetDescription>
                          Narrow down products by applying filters
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4">
                        <Accordion type="multiple" className="w-full">
                          {sizeOptions.length > 0 && (
                            <AccordionItem value="size">
                              <AccordionTrigger>Size</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {sizeOptions.map(size => (
                                    <div key={size} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`mobile-size-${size}`} 
                                        checked={selectedSizes.includes(size)}
                                        onCheckedChange={() => handleSizeToggle(size)}
                                      />
                                      <Label htmlFor={`mobile-size-${size}`}>{size}</Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {colorOptions.length > 0 && (
                            <AccordionItem value="color">
                              <AccordionTrigger>Color</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {colorOptions.map(color => (
                                    <div key={color} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`mobile-color-${color}`} 
                                        checked={selectedColors.includes(color)}
                                        onCheckedChange={() => handleColorToggle(color)}
                                      />
                                      <Label htmlFor={`mobile-color-${color}`}>{color}</Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          {priceStats.min !== Infinity && priceStats.max > priceStats.min && (
                            <AccordionItem value="price">
                              <AccordionTrigger>Price Range</AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm mb-2">
                                  Min: ₹{priceStats.min.toFixed(2)} - Max: ₹{priceStats.max.toFixed(2)}
                                </p>
                                <div className="space-y-2">
                                  {priceSelectOptions.map(opt => (
                                     <div key={`mobile-price-${opt.value}`} className="flex items-center space-x-2">
                                       <Checkbox 
                                         id={`mobile-price-${opt.value}`}
                                         checked={priceRange?.[0] === parseFloat(opt.value.split('-')[0]) && priceRange?.[1] === parseFloat(opt.value.split('-')[1])}
                                         onCheckedChange={(checked) => {
                                            if(checked) {
                                                const [min, max] = opt.value.split('-').map(Number);
                                                setPriceRange([min,max]);
                                            } else if (priceRange?.[0] === parseFloat(opt.value.split('-')[0]) && priceRange?.[1] === parseFloat(opt.value.split('-')[1])) {
                                                setPriceRange(null); // Uncheck clears
                                            }
                                         }}
                                       />
                                       <Label htmlFor={`mobile-price-${opt.value}`}>{opt.label}</Label>
                                     </div>
                                  ))}
                                  {priceRange && (
                                    <Button variant="link" size="sm" onClick={() => setPriceRange(null)}>Clear price filter</Button>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}
                        </Accordion>
                      </div>
                      <SheetFooter>
                        <div className="flex space-x-2 w-full">
                           <SheetClose asChild>
                            <Button variant="outline" className="flex-1" onClick={clearFilters}>Clear All</Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button className="flex-1">Apply</Button>
                          </SheetClose>
                        </div>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <>
                    {/* Desktop Filters */}
                    <div className="flex items-center gap-4">
                      {priceSelectOptions.length > 0 && (
                        <Select 
                          value={priceRange ? formatPriceValue(priceRange[0], priceRange[1]) : ALL_PRICES_VALUE} 
                          onValueChange={(value) => {
                            if (value === ALL_PRICES_VALUE) {
                              setPriceRange(null);
                            } else {
                              const [min, max] = value.split('-').map(Number);
                              setPriceRange([min, max]);
                            }
                          }}
                        >
                          <SelectTrigger className="w-[200px]"> {/* Increased width for price */}
                            <SelectValue placeholder="Price Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_PRICES_VALUE}>All Prices</SelectItem>
                            {priceSelectOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {sizeOptions.length > 0 && (
                        <Select 
                          value={selectedSizes.length === 1 ? selectedSizes[0] : ALL_SIZES_VALUE} 
                          onValueChange={(value) => {
                            if (value === ALL_SIZES_VALUE) {
                              setSelectedSizes([]);
                            } else {
                              setSelectedSizes([value]); // Desktop select for size is single-select
                            }
                          }}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_SIZES_VALUE}>All Sizes</SelectItem>
                            {sizeOptions.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {colorOptions.length > 0 && (
                        <Select 
                          value={selectedColors.length === 1 ? selectedColors[0] : ALL_COLORS_VALUE} 
                          onValueChange={(value) => {
                            if (value === ALL_COLORS_VALUE) {
                              setSelectedColors([]);
                            } else {
                              setSelectedColors([value]); // Desktop select for color is single-select
                            }
                          }}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={ALL_COLORS_VALUE}>All Colors</SelectItem>
                            {colorOptions.map(color => (
                              <SelectItem key={color} value={color}>{color}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange) && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div>
                <Select value={sortOption} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange) && !isMobile && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSizes.map(size => (
                  <Button
                    key={`tag-size-${size}`}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleSizeToggle(size)} // Toggles off
                  >
                    Size: {size} <span className="ml-1">✕</span>
                  </Button>
                ))}
                {selectedColors.map(color => (
                  <Button
                    key={`tag-color-${color}`}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleColorToggle(color)} // Toggles off
                  >
                    Color: {color} <span className="ml-1">✕</span>
                  </Button>
                ))}
                {priceRange && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => setPriceRange(null)}
                  >
                    Price: {formatPriceDisplay(priceRange[0], priceRange[1])} <span className="ml-1">✕</span>
                  </Button>
                )}
              </div>
            )}

            <ProductGrid 
              products={sortedAndFilteredProducts} 
              emptyMessage={productGridEmptyMessage}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CategoryPage;