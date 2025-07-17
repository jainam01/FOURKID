// File: client/src/pages/admin/AdminReviewsPage.tsx

import { useAdminGetAllReviews, useApproveReview, useDeleteReview } from "@/lib/api";
import { AdminReview } from "@shared/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { CheckCircle, Loader2, MoreHorizontal, AlertTriangle, Trash2, Star, UserX, PackageX } from "lucide-react"; // Added UserX and PackageX

// A small helper component for the rating badge
const RatingBadge = ({ rating }: { rating: number }) => (
  <Badge
    variant={rating >= 4 ? "default" : rating >= 3 ? "secondary" : "destructive"}
    className={rating >= 4 ? "bg-green-600 text-white hover:bg-green-700" : ""}
  >
    {rating} <Star className="ml-1 h-3 w-3" fill="currentColor" />
  </Badge>
);

// A helper component for the status badge
const StatusBadge = ({ status }: { status: 'pending' | 'approved' }) => (
  <Badge variant={status === "approved" ? "default" : "secondary"}
         className={status === 'approved' ? 'bg-green-100 text-green-800 border-green-300' : ''}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </Badge>
);

const AdminReviewsPage = () => {
  const { data: reviews, isLoading, error } = useAdminGetAllReviews();
  const approveReviewMutation = useApproveReview();
  const deleteReviewMutation = useDeleteReview();

  const handleApproveReview = (reviewId: number) => {
    approveReviewMutation.mutate(reviewId);
  };

  const handleDeleteReview = (reviewId: number) => {
    if (window.confirm("Are you sure you want to permanently delete this review?")) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Customer Reviews</CardTitle>
        <CardDescription>Approve or delete customer-submitted reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        {(!reviews || reviews.length === 0) ? (
          <div className="py-16 text-center text-muted-foreground">
            No reviews found.
          </div>
        ) : (
          <>
            {/* --- DESKTOP VIEW: TABLE --- */}
            <div className="hidden md:block">
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
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      {/* --- FIX 1: Check if product exists --- */}
                      <TableCell className="font-medium">
                        {review.product?.name ?? (
                            <span className="text-muted-foreground italic flex items-center">
                                <PackageX className="h-4 w-4 mr-2" /> Deleted Product
                            </span>
                        )}
                      </TableCell>
                      {/* --- FIX 2: Check if user exists --- */}
                      <TableCell>
                        {review.user ? (
                          <>
                            <div>{review.user.name}</div>
                            <div className="text-xs text-muted-foreground">{review.user.email}</div>
                          </>
                        ) : (
                          <span className="text-muted-foreground italic flex items-center">
                            <UserX className="h-4 w-4 mr-2" /> Deleted User
                          </span>
                        )}
                      </TableCell>
                      <TableCell><RatingBadge rating={review.rating} /></TableCell>
                      <TableCell className="max-w-xs truncate" title={review.comment}>{review.comment}</TableCell>
                      <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell><StatusBadge status={review.status} /></TableCell>
                      <TableCell className="text-right">
                        <ReviewActions review={review} onApprove={handleApproveReview} onDelete={handleDeleteReview} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* --- MOBILE VIEW: CARD LIST --- */}
            <div className="space-y-4 md:hidden">
              {reviews.map((review) => (
                <Card key={review.id} className="w-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        {/* --- FIX 3: Check product and user on mobile view --- */}
                        <CardTitle className="text-base">
                          {review.product?.name ?? "Deleted Product"}
                        </CardTitle>
                        <CardDescription>
                          by {review.user?.name ?? "Deleted User"}
                        </CardDescription>
                      </div>
                      <ReviewActions review={review} onApprove={handleApproveReview} onDelete={handleDeleteReview} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <RatingBadge rating={review.rating} />
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{review.comment}</p>
                  </CardContent>
                  <CardFooter>
                    <StatusBadge status={review.status} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Extracted Actions Dropdown for reusability
const ReviewActions = ({ review, onApprove, onDelete }: { review: AdminReview, onApprove: (id: number) => void, onDelete: (id: number) => void }) => {
  const approveReviewMutation = useApproveReview();
  const deleteReviewMutation = useDeleteReview();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => onApprove(review.id)}
          disabled={review.status === 'approved' || approveReviewMutation.isPending}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          <span>Approve</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onClick={() => onDelete(review.id)}
          disabled={deleteReviewMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminReviewsPage;