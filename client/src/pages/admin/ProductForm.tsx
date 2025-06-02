import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCategories, useProduct, useCreateProduct, useUpdateProduct } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { insertProductSchema, ProductVariant } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react";

// Extend the product schema with validation
const productFormSchema = insertProductSchema.extend({
  images: z.array(z.string()).min(1, "At least one image URL is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const productId = isEditing ? parseInt(id) : 0;
  
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { data: categories = [] } = useCategories();
  const { data: product, isLoading: isLoadingProduct } = useProduct(productId, { enabled: isEditing && productId > 0 });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const [imageInput, setImageInput] = useState("");
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariantName, setNewVariantName] = useState("");
  const [newVariantValue, setNewVariantValue] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sku: "",
      price: 0,
      stock: 0,
      images: [],
      categoryId: 0,
      variants: [],
    },
  });

  // Update form values when product data loads
  useEffect(() => {
    if (product && isEditing) {
      form.reset({
        name: product.name,
        description: product.description || "",
        sku: product.sku,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: product.categoryId,
      });
      
      if (product.variants) {
        setVariants(product.variants);
      }
    }
  }, [product, isEditing, form]);

  const addImage = () => {
    if (!imageInput.trim()) return;
    
    const currentImages = form.getValues().images || [];
    form.setValue("images", [...currentImages, imageInput]);
    setImageInput("");
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues().images || [];
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  const addVariant = () => {
    if (!newVariantName.trim() || !newVariantValue.trim()) return;
    
    setVariants([...variants, { name: newVariantName, value: newVariantValue }]);
    setNewVariantName("");
    setNewVariantValue("");
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Add variants to the data
      const productData = {
        ...data,
        variants: variants.length > 0 ? variants : undefined,
      };
      
      if (isEditing && product) {
        await updateProduct.mutateAsync({
          id: product.id,
          data: productData,
        });
        toast({
          title: "Product updated",
          description: `${data.name} has been successfully updated.`,
        });
      } else {
        await createProduct.mutateAsync(productData);
        toast({
          title: "Product created",
          description: `${data.name} has been successfully created.`,
        });
      }
      
      navigate("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditing && isLoadingProduct) {
    return (
      <AdminLayout>
        <div className="py-8 text-center">Loading product data...</div>
      </AdminLayout>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{isEditing ? "Edit Product" : "Add New Product"} - Fourkids Wholesale</title>
        <meta 
          name="description" 
          content={isEditing ? "Edit existing product details" : "Add a new product to your inventory"} 
        />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit ${product?.name}` : "Add New Product"}
          </h1>
        </div>
        <Button type="submit" form="product-form">
          <Save className="h-4 w-4 mr-2" />
          {isEditing ? "Update Product" : "Save Product"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description" 
                              className="resize-none min-h-32"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter product SKU" {...field} />
                            </FormControl>
                            <FormDescription>
                              Unique identifier for this product
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              defaultValue={field.value.toString()}
                              value={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0"
                                min="0"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Product Images</h2>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Enter image URL"
                              value={imageInput}
                              onChange={(e) => setImageInput(e.target.value)}
                            />
                            <Button type="button" onClick={addImage}>Add</Button>
                          </div>
                          <FormMessage />
                          
                          <div className="mt-4">
                            {field.value?.length > 0 ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {field.value.map((image, index) => (
                                  <div key={index} className="relative group">
                                    <img
                                      src={image}
                                      alt={`Product image ${index + 1}`}
                                      className="w-full aspect-square object-cover rounded-md border"
                                    />
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => removeImage(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 border rounded-md">
                                <p className="text-gray-500">No images added yet</p>
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">Product Variants</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Variant Name</label>
                        <Input
                          placeholder="e.g. Size, Color"
                          value={newVariantName}
                          onChange={(e) => setNewVariantName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Variant Value</label>
                        <Input
                          placeholder="e.g. XL, Red"
                          value={newVariantValue}
                          onChange={(e) => setNewVariantValue(e.target.value)}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button 
                          type="button" 
                          onClick={addVariant}
                          disabled={!newVariantName || !newVariantValue}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Variant
                        </Button>
                      </div>
                    </div>

                    <div>
                      {variants.length > 0 ? (
                        <div className="space-y-2">
                          {variants.map((variant, index) => (
                            <div key={index} className="flex justify-between items-center border p-3 rounded-md">
                              <div>
                                <span className="font-medium">{variant.name}: </span>
                                <span>{variant.value}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeVariant(index)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-md">
                          <p className="text-gray-500">No variants added yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Product Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{form.watch("name") || "Not set"}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm text-gray-500">SKU</label>
                  <p className="font-medium">{form.watch("sku") || "Not set"}</p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">
                    {form.watch("categoryId") 
                      ? categories.find(c => c.id === form.watch("categoryId"))?.name || "Unknown"
                      : "Not set"
                    }
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <p className="font-medium text-primary">
                    {form.watch("price") ? `₹${form.watch("price").toFixed(2)}` : "₹0.00"}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Stock</label>
                  <p className="font-medium">
                    {form.watch("stock") || "0"} units
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm text-gray-500">Images</label>
                  <p className="font-medium">
                    {form.watch("images")?.length || 0} added
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500">Variants</label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {variants.length > 0 ? (
                      variants.map((variant, index) => (
                        <Badge key={index} variant="outline">
                          {variant.name}: {variant.value}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No variants</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="w-full" type="submit" form="product-form">
                  <Save className="h-4 w-4 mr-2" />
                  {isEditing ? "Update Product" : "Save Product"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
