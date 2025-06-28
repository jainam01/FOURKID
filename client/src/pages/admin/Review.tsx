import { useAdminGetAllReviews } from "@/lib/api"; // Assuming your hook is here
import { AdminReview } from "@shared/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Loader2, MoreHorizontal, AlertTriangle, Trash2 } from "lucide-react";

const AdminReviewsPage = () => {
  // 1. Fetch review data using your hook
  const { data: reviews, isLoading, error } = useAdminGetAllReviews();

  // 2. Handle API states (Loading, Error, No Data)
  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center text-destructive">
        <AlertTriangle className="h-8 w-8" />
        <p className="mt-2 font-semibold">Failed to load reviews.</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }
  
  // Placeholder functions for actions. In a real app, these would trigger mutations.
  const handleApproveReview = (reviewId: number) => {
    console.log(`Approving review with ID: ${reviewId}`);
    // Example: approveReviewMutation.mutate(reviewId);
    alert(`Approving review #${reviewId}`);
  };

  const handleDeleteReview = (reviewId: number) => {
    console.log(`Deleting review with ID: ${reviewId}`);
    // Example: deleteReviewMutation.mutate(reviewId);
    alert(`Deleting review #${reviewId}`);
  };

  // 3. Render the main page content
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {(!reviews || reviews.length === 0) ? (
            <div className="py-16 text-center text-muted-foreground">
              No reviews found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review: AdminReview) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.product.name}</TableCell>
                    <TableCell>
                      <div>{review.user.name}</div>
                      <div className="text-xs text-muted-foreground">{review.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          review.rating >= 4 ? "default" : review.rating === 3 ? "secondary" : "destructive"
                        }
                        className={review.rating >= 4 ? "bg-green-600 text-white" : ""}
                      >
                        {review.rating} ★
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={review.comment}>
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                       <Badge variant={review.status === "approved" ? "default" : "secondary"}>
                          {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleApproveReview(review.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            <span>Approve</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteReview(review.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviewsPage;