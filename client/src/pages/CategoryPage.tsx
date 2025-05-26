import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type SortOption = "newest" | "price-asc" | "price-desc";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsByCategorySlug(slug);
  const { data: category, isLoading: isLoadingCategory } = useCategoryBySlug(slug);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filteredProducts, setFilteredProducts] = useState<ProductWithDetails[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const isMobile = useMobile();

  // Extract all available variants from products
  const allVariants = {
    sizes: new Set<string>(),
    colors: new Set<string>(),
  };

  products.forEach(product => {
    if (product.variants) {
      product.variants.forEach(variant => {
        if (variant.name.toLowerCase() === 'size') {
          allVariants.sizes.add(variant.value);
        } else if (variant.name.toLowerCase() === 'color') {
          allVariants.colors.add(variant.value);
        }
      });
    }
  });

  const sizeOptions = Array.from(allVariants.sizes).sort();
  const colorOptions = Array.from(allVariants.colors).sort();

  // Get min and max price
  const priceStats = products.reduce(
    (stats, product) => ({
      min: Math.min(stats.min, product.price),
      max: Math.max(stats.max, product.price),
    }),
    { min: Infinity, max: 0 }
  );

  // Apply sorting and filtering
  const getSortedAndFilteredProducts = () => {
    let result = [...products];

    // Apply price filter if set
    if (priceRange) {
      result = result.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
    }

    // Apply size filter if any selected
    if (selectedSizes.length > 0) {
      result = result.filter(product =>
        product.variants?.some(
          variant =>
            variant.name.toLowerCase() === 'size' && selectedSizes.includes(variant.value)
        )
      );
    }

    // Apply color filter if any selected
    if (selectedColors.length > 0) {
      result = result.filter(product =>
        product.variants?.some(
          variant =>
            variant.name.toLowerCase() === 'color' && selectedColors.includes(variant.value)
        )
      );
    }

    // Apply sorting
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
  };

  // Update filtered products when dependencies change
  useState(() => {
    setFilteredProducts(getSortedAndFilteredProducts());
  });

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
    setFilteredProducts(getSortedAndFilteredProducts());
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const applyFilters = () => {
    setFilteredProducts(getSortedAndFilteredProducts());
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(null);
    setFilteredProducts(products.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }));
    setSortOption("newest");
  };

  const isLoading = isLoadingProducts || isLoadingCategory;

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
            {/* Category Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{category?.name || 'Products'}</h1>
              {category?.description && (
                <p className="text-gray-600 mt-2">{category.description}</p>
              )}
            </div>

            {/* Filter and Sort Controls */}
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
                        <Accordion type="single" collapsible className="w-full">
                          {sizeOptions.length > 0 && (
                            <AccordionItem value="size">
                              <AccordionTrigger>Size</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {sizeOptions.map(size => (
                                    <div key={size} className="flex items-center space-x-2">
                                      <Checkbox 
                                        id={`size-${size}`} 
                                        checked={selectedSizes.includes(size)}
                                        onCheckedChange={() => handleSizeToggle(size)}
                                      />
                                      <Label htmlFor={`size-${size}`}>{size}</Label>
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
                                        id={`color-${color}`} 
                                        checked={selectedColors.includes(color)}
                                        onCheckedChange={() => handleColorToggle(color)}
                                      />
                                      <Label htmlFor={`color-${color}`}>{color}</Label>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          )}

                          <AccordionItem value="price">
                            <AccordionTrigger>Price Range</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm mb-2">
                                ₹{priceStats.min.toFixed(2)} - ₹{priceStats.max.toFixed(2)}
                              </p>
                              {/* Simple price range selection */}
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="price-low" 
                                    checked={priceRange?.[1] === priceStats.min + ((priceStats.max - priceStats.min) / 3)}
                                    onCheckedChange={() => setPriceRange([priceStats.min, priceStats.min + ((priceStats.max - priceStats.min) / 3)])}
                                  />
                                  <Label htmlFor="price-low">Low (₹{priceStats.min.toFixed(2)} - ₹{(priceStats.min + ((priceStats.max - priceStats.min) / 3)).toFixed(2)})</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="price-mid" 
                                    checked={priceRange?.[0] === priceStats.min + ((priceStats.max - priceStats.min) / 3) && priceRange?.[1] === priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)}
                                    onCheckedChange={() => setPriceRange([priceStats.min + ((priceStats.max - priceStats.min) / 3), priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)])}
                                  />
                                  <Label htmlFor="price-mid">Medium (₹{(priceStats.min + ((priceStats.max - priceStats.min) / 3)).toFixed(2)} - ₹{(priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)).toFixed(2)})</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox 
                                    id="price-high" 
                                    checked={priceRange?.[0] === priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)}
                                    onCheckedChange={() => setPriceRange([priceStats.min + (2 * (priceStats.max - priceStats.min) / 3), priceStats.max])}
                                  />
                                  <Label htmlFor="price-high">High (₹{(priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)).toFixed(2)} - ₹{priceStats.max.toFixed(2)})</Label>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      <SheetFooter>
                        <div className="flex space-x-2 w-full">
                          <Button variant="outline" className="flex-1" onClick={clearFilters}>Clear All</Button>
                          <Button className="flex-1" onClick={applyFilters}>Apply Filters</Button>
                        </div>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                ) : (
                  <>
                    {/* Desktop Filters */}
                    <div className="flex items-center gap-4">
                      {/* Price Range Filter */}
                      {priceStats.min !== Infinity && (
                        <Select value={priceRange ? `${priceRange[0]}-${priceRange[1]}` : ""} onValueChange={(value) => {
                          if (!value) {
                            setPriceRange(null);
                          } else {
                            const [min, max] = value.split('-').map(Number);
                            setPriceRange([min, max]);
                          }
                          applyFilters();
                        }}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Price Range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Prices</SelectItem>
                            <SelectItem value={`${priceStats.min}-${priceStats.min + ((priceStats.max - priceStats.min) / 3)}`}>
                              ₹{priceStats.min.toFixed(2)} - ₹{(priceStats.min + ((priceStats.max - priceStats.min) / 3)).toFixed(2)}
                            </SelectItem>
                            <SelectItem value={`${priceStats.min + ((priceStats.max - priceStats.min) / 3)}-${priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)}`}>
                              ₹{(priceStats.min + ((priceStats.max - priceStats.min) / 3)).toFixed(2)} - ₹{(priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)).toFixed(2)}
                            </SelectItem>
                            <SelectItem value={`${priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)}-${priceStats.max}`}>
                              ₹{(priceStats.min + (2 * (priceStats.max - priceStats.min) / 3)).toFixed(2)} - ₹{priceStats.max.toFixed(2)}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {/* Size Filter */}
                      {sizeOptions.length > 0 && (
                        <Select value={selectedSizes.length > 0 ? selectedSizes.join(',') : ""} onValueChange={(value) => {
                          if (!value) {
                            setSelectedSizes([]);
                          } else {
                            setSelectedSizes([value]);
                          }
                          applyFilters();
                        }}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Sizes</SelectItem>
                            {sizeOptions.map(size => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {/* Color Filter */}
                      {colorOptions.length > 0 && (
                        <Select value={selectedColors.length > 0 ? selectedColors.join(',') : ""} onValueChange={(value) => {
                          if (!value) {
                            setSelectedColors([]);
                          } else {
                            setSelectedColors([value]);
                          }
                          applyFilters();
                        }}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Colors</SelectItem>
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

              {/* Sort Options */}
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

            {/* Filter Tags/Breadcrumbs */}
            {(selectedSizes.length > 0 || selectedColors.length > 0 || priceRange) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedSizes.map(size => (
                  <Button
                    key={`size-${size}`}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setSelectedSizes(prev => prev.filter(s => s !== size));
                      applyFilters();
                    }}
                  >
                    Size: {size} ✕
                  </Button>
                ))}
                {selectedColors.map(color => (
                  <Button
                    key={`color-${color}`}
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setSelectedColors(prev => prev.filter(c => c !== color));
                      applyFilters();
                    }}
                  >
                    Color: {color} ✕
                  </Button>
                ))}
                {priceRange && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => {
                      setPriceRange(null);
                      applyFilters();
                    }}
                  >
                    Price: ₹{priceRange[0].toFixed(2)} - ₹{priceRange[1].toFixed(2)} ✕
                  </Button>
                )}
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid 
              products={filteredProducts.length > 0 ? filteredProducts : products} 
              emptyMessage={`No products found in the ${category?.name || ''} category with the selected filters.`}
            />
          </>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
