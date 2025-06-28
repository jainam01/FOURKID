import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useCategories, useDeleteCategory } from "@/lib/api";
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye } from "lucide-react";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Category } from "@shared/schema";

const ManageCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id);
      toast({
        title: "Category Deleted",
        description: `"${categoryToDelete.name}" has been successfully deleted.`
      });
      setCategoryToDelete(null);
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete category. It may have associated products.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Manage Categories - Fourkids Admin</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Organize your products into categories.</p>
        </div>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Category
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search categories by name or description..."
                    className="pl-10 h-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading categories...</div>
      ) : (
        <>
          {filteredCategories.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-dashed border-2 rounded-lg">
              <p className="font-medium">{searchQuery ? "No categories match your search." : "No categories found."}</p>
              <p className="text-sm mt-2">{searchQuery ? "Try a different search term." : "Get started by adding a new category."}</p>
            </div>
          ) : (
            <div>
              {/* --- DESKTOP VIEW: TABLE --- */}
              <div className="hidden md:block border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell className="text-muted-foreground max-w-sm truncate">{category.description || "-"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild><Link href={`/category/${category.slug}`} target="_blank"><Eye className="h-4 w-4 mr-2"/>View on Site</Link></DropdownMenuItem>
                              <DropdownMenuItem asChild><Link href={`/admin/categories/edit/${category.id}`}><Edit className="h-4 w-4 mr-2"/>Edit</Link></DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => setCategoryToDelete(category)}><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* --- MOBILE VIEW: CARDS --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                        <CardTitle>{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
                        {category.description || "No description provided."}
                      </p>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-2 border-t flex justify-end">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex-1 justify-center">
                              Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/category/${category.slug}`} target="_blank"><Eye className="h-4 w-4 mr-2"/>View on Site</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/admin/categories/edit/${category.id}`}><Edit className="h-4 w-4 mr-2"/>Edit</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => setCategoryToDelete(category)}><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{categoryToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteCategory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageCategories;