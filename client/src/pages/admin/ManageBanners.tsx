// File: client/src/pages/admin/ManageBanners.tsx

import { useState } from "react";
import { Helmet } from "react-helmet-async";
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

const bannerFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  desktopImage: z.string().url("Please enter a valid URL").min(1, "Desktop Image URL is required"),
  mobileImage: z.string().url("Please enter a valid URL").min(1, "Mobile Image URL is required"),
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
      desktopImage: "",
      mobileImage: "",
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
        desktopImage: banner.desktopImage,
        mobileImage: banner.mobileImage,
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
        desktopImage: "",
        mobileImage: "",
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

  const bannersByType = banners.reduce<Record<string, Banner[]>>((acc, banner) => {
    (acc[banner.type] = acc[banner.type] || []).push(banner);
    return acc;
  }, {});

  return (
    <div>
      <Helmet>
        <title>Manage Banners - Fourkids</title>
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
      ) : banners.length === 0 ? (
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
                            src={banner.desktopImage}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>{banner.position}</TableCell>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl grid-rows-[auto_1fr_auto] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            <DialogDescription>
              Fill in the details for the banner. The form will scroll if content overflows.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-6">
            <Form {...form}>
              <form id="banner-form" onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Summer Sale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., Up to 50% off on all items" 
                            className="resize-none"
                            {...field} 
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="desktopImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desktop Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>Recommended size: 1920x800px</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="mobileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormDescription>Recommended size: 800x1200px</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="/category/some-slug" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            This banner will be displayed on the website.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

              </form>
            </Form>
          </div>
          
          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" type="button" onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" form="banner-form">
              {editingBanner ? "Update Banner" : "Add Banner"}
            </Button>
          </DialogFooter>

        </DialogContent>
      </Dialog>

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