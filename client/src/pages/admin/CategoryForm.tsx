import { useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { useCategory, useCreateCategory, useUpdateCategory } from "@/lib/api";
import { insertCategorySchema } from "@shared/schema";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Extend the category schema with validation for slug
const categoryFormSchema = insertCategorySchema.extend({
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug cannot exceed 50 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const categoryId = isEditing ? parseInt(id) : 0;
  
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
    },
  });

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
      .trim();
  };

  // Auto-generate slug when name changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const currentSlug = form.getValues("slug");
        // Only auto-generate if slug is empty or has not been manually edited
        if (!currentSlug || currentSlug === generateSlug(form.getValues("name") || "")) {
          form.setValue("slug", generateSlug(value.name || ""), {
            shouldValidate: true,
          });
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  // Update form values when category data loads
  useEffect(() => {
    if (category && isEditing) {
      form.reset({
        name: category.name,
        description: category.description || "",
        slug: category.slug,
      });
    }
  }, [category, isEditing, form]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEditing && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data,
        });
        toast({
          title: "Category updated",
          description: `${data.name} has been successfully updated.`,
        });
      } else {
        await createCategory.mutateAsync(data);
        toast({
          title: "Category created",
          description: `${data.name} has been successfully created.`,
        });
      }
      
      navigate("/admin/categories");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isEditing && isLoadingCategory) {
    return (
      <AdminLayout>
        <div className="py-8 text-center">Loading category data...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{isEditing ? "Edit Category" : "Add New Category"} - Fourkids Wholesale</title>
        <meta 
          name="description" 
          content={isEditing ? "Edit existing category details" : "Add a new product category"} 
        />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <a href="/admin/categories">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit ${category?.name}` : "Add New Category"}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter slug" {...field} />
                      </FormControl>
                      <FormDescription>
                        Used in URLs: fourkids.com/category/{field.value || "example-slug"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter category description" 
                          className="resize-none min-h-24"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/admin/categories")}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update Category" : "Save Category"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
