import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@/lib/api";
import { Edit, ImageIcon, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Banner, InsertBanner } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Create a form schema based on the banner schema
const bannerFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image: z.string().min(1, "Image URL is required"),
  link: z.string().optional(),
  type: z.string().min(1, "Banner type is required"),
  active: z.boolean().default(true),
  position: z.number().int().default(0),
});

type BannerFormValues = z.infer<typeof bannerFormSchema>;

const ManageBanners = () => {
  const { data: banners = [], isLoading } = useBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
      type: "hero",
      active: true,
      position: 0,
    },
  });

  const openDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      form.reset({
        title: banner.title,
        description: banner.description || "",
        image: banner.image,
        link: banner.link || "",
        type: banner.type,
        active: banner.active,
        position: banner.position,
      });
    } else {
      setEditingBanner(null);
      form.reset({
        title: "",
        description: "",
        image: "",
        link: "",
        type: "hero",
        active: true,
        position: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
  };

  const onSubmit = async (data: BannerFormValues) => {
    try {
      if (editingBanner) {
        await updateBanner.mutateAsync({
          id: editingBanner.id,
          data
        });
        toast({
          title: "Banner updated",
          description: "The banner has been successfully updated."
        });
      } else {
        await createBanner.mutateAsync(data as InsertBanner);
        toast({
          title: "Banner created",
          description: "The banner has been successfully created."
        });
      }
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banner. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBanner = async () => {
    if (!bannerToDelete) return;
    
    try {
      await deleteBanner.mutateAsync(bannerToDelete.id);
      toast({
        title: "Banner deleted",
        description: "The banner has been successfully deleted."
      });
      setBannerToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleBannerActive = async (banner: Banner) => {
    try {
      await updateBanner.mutateAsync({
        id: banner.id,
        data: { active: !banner.active }
      });
      toast({
        title: banner.active ? "Banner deactivated" : "Banner activated",
        description: `The banner has been ${banner.active ? "deactivated" : "activated"}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Group banners by type
  const bannersByType = banners.reduce<Record<string, Banner[]>>((acc, banner) => {
    if (!acc[banner.type]) {
      acc[banner.type] = [];
    }
    acc[banner.type].push(banner);
    return acc;
  }, {});

  return (
    <div>
      <Helmet>
        <title>Manage Banners - Fourkids Wholesale</title>
        <meta name="description" content="Manage promotional banners for Fourkids wholesale e-commerce platform" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Banners</h1>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading banners...</div>
      ) : (
        <>
          {banners.length === 0 ? (
            <div className="py-16 text-center border rounded-lg">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No banners found</h3>
              <p className="text-gray-500 mb-6">Start adding promotional banners to enhance your homepage.</p>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Banner
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(bannersByType).map(([type, typeBanners]) => (
                <div key={type} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h2 className="font-medium capitalize">{type} Banners</h2>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typeBanners.map((banner) => (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <div className="w-16 h-10 rounded overflow-hidden bg-gray-100">
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{banner.title}</TableCell>
                          <TableCell>{banner.position}</TableCell>
                          <TableCell>
                            {banner.link ? (
                              <span className="text-blue-600 hover:underline truncate block max-w-[200px]">
                                {banner.link}
                              </span>
                            ) : (
                              <span className="text-gray-400">No link</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={banner.active}
                                onCheckedChange={() => toggleBannerActive(banner)}
                                aria-label="Toggle banner active state"
                              />
                              <Badge variant={banner.active ? "default" : "secondary"}>
                                {banner.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openDialog(banner)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => setBannerToDelete(banner)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Banner Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            <DialogDescription>
              {editingBanner 
                ? "Update the banner details below." 
                : "Fill in the details to add a new promotional banner."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter banner title" {...field} />
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
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter banner description" 
                        className="resize-none"
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a banner type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="sale">Sale</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Display order position"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter link URL" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active</FormLabel>
                      <FormDescription>
                        Whether this banner should be displayed on the website.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button variant="outline" type="button" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBanner ? "Update Banner" : "Add Banner"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!bannerToDelete} onOpenChange={() => setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the banner "{bannerToDelete?.title}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteBanner}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageBanners;
