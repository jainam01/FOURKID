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
import { useProducts, useDeleteProduct } from "@/lib/api";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductWithDetails } from "@shared/schema";

const ManageProducts = () => {
  const { data: products = [], isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [productToDelete, setProductToDelete] = useState<ProductWithDetails | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast({
        title: "Product Deleted",
        description: `"${productToDelete.name}" has been successfully deleted.`
      });
      setProductToDelete(null);
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive"
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const StockBadge = ({ stock }: { stock: number }) => {
    if (stock <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (stock <= 10) {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">Low Stock ({stock})</Badge>;
    }
    return <Badge variant="secondary">In Stock ({stock})</Badge>;
  };

  return (
    <>
      <Helmet>
        <title>Manage Products - Fourkids Admin</title>
        <meta name="description" content="Manage product inventory for the Fourkids platform." />
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name, SKU, or category..."
              className="pl-10 h-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground">Loading products...</div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground border-dashed border-2 rounded-lg">
              <p className="font-medium">{searchQuery ? "No products match your search." : "No products found."}</p>
              <p className="text-sm mt-2">{searchQuery ? "Try a different search term." : "Get started by adding a new product."}</p>
            </div>
          ) : (
            <div>
              {/* --- DESKTOP VIEW: TABLE (Hidden on mobile) --- */}
              <div className="hidden md:block border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell><img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-md bg-gray-100"/></TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell><Badge variant="secondary">{product.sku}</Badge></TableCell>
                        <TableCell>{product.category?.name || 'N/A'}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell><StockBadge stock={product.stock} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild><Link href={`/product/${product.id}`} target="_blank"><Eye className="h-4 w-4 mr-2"/>View on Site</Link></DropdownMenuItem>
                              <DropdownMenuItem asChild><Link href={`/admin/products/edit/${product.id}`}><Edit className="h-4 w-4 mr-2"/>Edit</Link></DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => setProductToDelete(product)}><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* --- MOBILE VIEW: CARDS (Hidden on desktop) --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardContent className="p-4 flex flex-col gap-4">
                      <div className="flex gap-4 items-start">
                        <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-md border" />
                        <div className="flex-grow">
                          <h3 className="font-bold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category.name}</p>
                          <Badge variant="secondary" className="mt-1">{product.sku}</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <p className="font-semibold">{formatPrice(product.price)}</p>
                        <StockBadge stock={product.stock} />
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 pt-0 bg-gray-50 border-t">
                      <div className="flex w-full justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex-1 justify-center">
                              Actions <MoreHorizontal className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href={`/product/${product.id}`} target="_blank"><Eye className="h-4 w-4 mr-2"/>View on Site</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href={`/admin/products/edit/${product.id}`}><Edit className="h-4 w-4 mr-2"/>Edit</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600" onClick={() => setProductToDelete(product)}><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product "{productToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteProduct}
            >
              Delete Product
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageProducts;