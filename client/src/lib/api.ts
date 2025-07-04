// File: client/src/lib/api.ts

// The top-level queryClient is removed as we will use the hook instead.
import { apiRequest } from "@/lib/queryClient"; 
import { useQuery, useMutation, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { 
  Product, Category, InsertProduct, InsertCategory, 
  CartItem, WatchlistItem,
  Order, InsertOrderItem, Banner, InsertBanner,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems,
  ProductVariant, AdminReview
} from "@shared/schema";

// Categories API
export function useCategories() {
  return useQuery<Category[]>({ queryKey: ['/api/categories'] });
}

export function useCategory(id?: number, options?: Omit<UseQueryOptions<Category, Error, Category>, 'queryKey' | 'queryFn'>) {
  return useQuery<Category, Error, Category>({
    queryKey: ['/api/categories', id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/categories/${id}`);
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
  return useQuery<ProductWithDetails[]>({ queryKey: ['/api/products'] });
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
  return useQuery<Product[]>({ queryKey: ['/api/products/category', categoryId], enabled: !!categoryId });
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
  return useQuery<CartItemWithProduct[]>({ queryKey: ['/api/cart'] });
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

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, AddReviewPayload>({
    mutationFn: async (payload: AddReviewPayload) => {
      const res = await apiRequest("POST", "/api/reviews", payload);
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: 'Failed to add review' }));
        throw new Error(error.message || 'Failed to add review');
      }
      return await res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', variables.productId] });
    }
  });
}

// Admin Reviews API
export function useAdminGetAllReviews() {
  return useQuery<AdminReview[]>({
    queryKey: ['/api/admin/reviews'],
  });
}

export function useApproveReview(options?: { onSuccess?: () => void; onError?: (error: Error) => void; }) {
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("PUT", `/api/admin/reviews/${reviewId}/approve`);
      if (!res.ok) throw new Error("Failed to approve review.");
      return res.json();
    },
    ...options,
  });
}

export function useDeleteReview(options?: { onSuccess?: () => void; onError?: (error: Error) => void; }) {
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (reviewId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/reviews/${reviewId}`);
      if (!res.ok) throw new Error("Failed to delete review.");
      return res.json();
    },
    ...options,
  });
}


// Watchlist API
type AddToWatchlistVariables = {
  productId: number;
};

export function useWatchlist() {
  return useQuery<WatchlistItemWithProduct[]>({ queryKey: ['/api/watchlist'] });
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
  return useQuery<OrderWithItems[]>({ queryKey: ['/api/orders'] });
}

export function useOrder(id: number) {
  return useQuery<OrderWithItems>({
    queryKey: ['/api/orders', id],
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation<Order, Error, { items: InsertOrderItem[]; address: string; total: number }>({
    mutationFn: async (orderData) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
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
  return useQuery<Banner[]>({ queryKey });
}

export function useBanner(id: number) {
  return useQuery<Banner>({
    queryKey: ['/api/banners', id],
    enabled: !!id,
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