// File: client/src/lib/api.ts

import { apiRequest } from "@/lib/queryClient"; 
import { useQuery, useMutation, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast"; // Ensure this path is correct for your project
import { 
  Product, Category, InsertProduct, InsertCategory, 
  CartItem, WatchlistItem,
  Order, InsertOrderItem, Banner, InsertBanner,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems,
  ProductVariant, AdminReview, Review,User ,createOrderInputSchema 
} from "@shared/schema";
import { z } from "zod";

// Categories API
export function useCategories() {
  return useQuery<Category[]>({ 
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories.");
      return res.json();
    }
  });
}

export function useCategory(id?: number, options?: Omit<UseQueryOptions<Category, Error, Category>, 'queryKey' | 'queryFn'>) {
  return useQuery<Category, Error, Category>({
    queryKey: ['/api/categories', id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/categories/${id}`);
      if (!res.ok) throw new Error("Failed to fetch category.");
      return await res.json();
    },
    enabled: !!id,
    ...options,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['/api/categories/slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/categories/slug/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch category by slug');
      return res.json();
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, InsertCategory>({
    mutationFn: async (categoryData) => {
      const res = await apiRequest("POST", "/api/categories", categoryData);
      return await res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/categories'] }); }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { id: number; data: Partial<InsertCategory> }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PUT", `/api/categories/${id}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories', data.id] });
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/categories/${id}`);
      return await res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/categories'] }); }
  });
}

// Products API
export function useProducts() {
  return useQuery<ProductWithDetails[]>({ 
    queryKey: ['/api/products'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products`);
      if (!res.ok) throw new Error("Failed to fetch products.");
      return res.json();
    }
  });
}

export function useProduct(id: number, options?: Omit<UseQueryOptions<ProductWithDetails, Error, ProductWithDetails>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['/api/products', id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/${id}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      return res.json();
    },
    enabled: !!id, 
    ...options,
  });
}

export function useProductsByCategory(categoryId: number) {
  return useQuery<Product[]>({ 
    queryKey: ['/api/products/category', categoryId], 
    enabled: !!categoryId,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/category/${categoryId}`);
      if (!res.ok) throw new Error("Failed to fetch products for this category.");
      return res.json();
    }
  });
}

export function useProductsByCategorySlug(slug: string) {
  return useQuery<ProductWithDetails[]>({
    queryKey: ['/api/products/category-slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/category-slug/${slug}`);
      if (!res.ok) throw new Error(`Failed to fetch products for category slug: ${slug}`);
      return res.json();
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, InsertProduct>({
    mutationFn: async (productData) => {
      const res = await apiRequest("POST", "/api/products", productData);
      return await res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/products'] }); }
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation<Product, Error, { id: number; data: Partial<InsertProduct> }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PUT", `/api/products/${id}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', data.id] });
    }
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/products/${id}`);
      return await res.json();
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['/api/products'] }); }
  });
}

// Cart API
type AddToCartVariables = {
  productId: number;
  quantity: number;
  variantInfo?: ProductVariant[];
};

export function useCart() {
  return useQuery<CartItemWithProduct[]>({ 
    queryKey: ['/api/cart'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/cart`);
      if (!res.ok) throw new Error("Failed to fetch cart.");
      return res.json();
    }
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, AddToCartVariables>({
    mutationFn: async (cartItemData) => {
      const res = await apiRequest("POST", "/api/cart", cartItemData);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add to cart');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation<CartItem, Error, { id: number; quantity: number }>({
    mutationFn: async ({ id, quantity }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/cart/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const res = await apiRequest("DELETE", "/api/cart");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });
}

// User Reviews API
interface AddReviewPayload {
  productId: number;
  rating: number;
  comment: string;
}

export interface ProductReview extends Pick<Review, 'id' | 'rating' | 'comment' | 'createdAt'> {
  user: Pick<User, 'name'> | null;
}

export function useAddReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation<{ message: string }, Error, { productId: number; rating: number; comment: string; }>({
    mutationFn: async (payload) => {
      const res = await apiRequest("POST", "/api/reviews", payload);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to add review' }));
        throw new Error(error.message || 'Failed to add review');
      }
      return await res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', variables.productId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Success",
        description: "Your review has been submitted and is pending approval.",
        className: "bg-green-600 text-white",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message,
      });
    }
  });
}


export function useProductReviews(productId?: number) {
  return useQuery<ProductReview[]>({
    queryKey: ['/api/products', productId, 'reviews'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/${productId}/reviews`);
      if (!res.ok) throw new Error("Failed to fetch product reviews.");
      return res.json();
    },
    enabled: !!productId,
  });
}


// --- ADMIN REVIEWS API ---
export function useAdminGetAllReviews() {
  return useQuery<AdminReview[]>({
    queryKey: ['/api/admin/reviews'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/reviews`);
      if (!res.ok) throw new Error("Failed to fetch admin reviews.");
      return res.json();
    }
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("PUT", `/api/admin/reviews/${reviewId}/approve`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to approve review." }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', variables, 'reviews'] });
      toast({
        title: "Success",
        description: "The review has been approved.",
        className: "bg-green-600 text-white",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message,
      });
    }
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to delete review." }));
        throw new Error(errorData.message);
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reviews'] });
      toast({
        title: "Success",
        description: "The review has been deleted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: error.message,
      });
    }
  });
}


// Watchlist API
type AddToWatchlistVariables = {
  productId: number;
};

export function useWatchlist() {
  return useQuery<WatchlistItemWithProduct[]>({ 
    queryKey: ['/api/watchlist'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/watchlist`);
      if (!res.ok) throw new Error("Failed to fetch watchlist.");
      return res.json();
    }
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  return useMutation<WatchlistItem, Error, AddToWatchlistVariables>({
    mutationFn: async (watchlistItemData) => {
      const res = await apiRequest("POST", "/api/watchlist", watchlistItemData);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'An unknown API error occurred' }));
        throw new Error(error.message || 'Failed to add to watchlist');
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
    }
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/watchlist/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
    }
  });
}

// Order API
export function useOrders() {
  return useQuery<OrderWithItems[]>({ 
    queryKey: ['/api/orders'],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders.");
      return res.json();
    }
  });
}

export function useOrder(id: number) {
  return useQuery<OrderWithItems>({
    queryKey: ['/api/orders', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/orders/${id}`);
      if (!res.ok) throw new Error("Failed to fetch order.");
      return res.json();
    }
  });
}

export function useCreateManualUpiOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, void>({ // It takes no arguments
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/orders/manual-upi");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Failed to place order." }));
        throw new Error(errorData.message);
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { id: number; status: string }>({
    mutationFn: async ({ id, status }) => {
      const res = await apiRequest("PUT", `/api/orders/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', data.id] });
    }
  });
}


// Banner API
export function useBanners(type?: string) {
  const queryKey = type ? ['/api/banners', { type }] : ['/api/banners'];
  return useQuery<Banner[]>({ 
    queryKey,
    queryFn: async () => {
      const url = type ? `/api/banners?type=${type}` : '/api/banners';
      const res = await apiRequest("GET", url);
      if (!res.ok) throw new Error("Failed to fetch banners.");
      return res.json();
    }
  });
}

export function useBanner(id: number) {
  return useQuery<Banner>({
    queryKey: ['/api/banners', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/banners/${id}`);
      if (!res.ok) throw new Error("Failed to fetch banner.");
      return res.json();
    }
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  return useMutation<Banner, Error, InsertBanner>({
    mutationFn: async (bannerData) => {
      const res = await apiRequest("POST", "/api/banners", bannerData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
    }
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation<Banner, Error, { id: number; data: Partial<InsertBanner> }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiRequest("PUT", `/api/banners/${id}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/banners', data.id] });
    }
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/banners/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
    }
  });
}


// --- NEW USER API SECTION ---

// This hook is for updating a user's password.
// It calls the new secure endpoint on the backend.
interface UpdatePasswordPayload {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export function useUpdatePassword() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, UpdatePasswordPayload>({
    mutationFn: async ({ userId, currentPassword, newPassword }) => {
      const res = await apiRequest("PUT", `/api/users/${userId}/password`, {
        currentPassword,
        newPassword,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "An unknown error occurred." }));
        throw new Error(errorData.message);
      }

      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: data.message || "Password updated successfully.",
        className: "bg-green-600 text-white",
      });
       // Invalidate queries that depend on user data to refetch them
       queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    },
  });
}

export { apiRequest };
