import { queryClient, apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Product, Category, InsertProduct, InsertCategory, 
  CartItem, InsertCartItem, WatchlistItem, InsertWatchlistItem,
  Order, InsertOrder, InsertOrderItem, Banner, InsertBanner,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems
} from "@shared/schema";

// Categories API
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
}

export function useCategory(id: number) {
  return useQuery<Category>({
    queryKey: ['/api/categories', id],
    enabled: !!id,
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery<Category>({
    queryKey: ['/api/categories/slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/categories/slug/${slug}`);
      if (!res.ok) {
        throw new Error('Failed to fetch category by slug');
      }
      return res.json();
    },
  });
}

export function useCreateCategory() {
  return useMutation<Category, Error, InsertCategory>({
    mutationFn: async (categoryData) => {
      const res = await apiRequest("POST", "/api/categories", categoryData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    }
  });
}

export function useUpdateCategory() {
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
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/categories/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    }
  });
}

// Products API
export function useProducts() {
  return useQuery<ProductWithDetails[]>({
    queryKey: ['/api/products'],
  });
}

export function useProduct(id: number, p0: { enabled: boolean; }) {
  return useQuery<ProductWithDetails>({
    queryKey: ['/api/products', id],
    enabled: !!id,
  });
}

export function useProductsByCategory(categoryId: number) {
  return useQuery<Product[]>({
    queryKey: ['/api/products/category', categoryId],
    enabled: !!categoryId,
  });
}

export function useProductsByCategorySlug(slug: string) {
  return useQuery<ProductWithDetails[]>({
    queryKey: ['/api/products/category-slug', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/products/category-slug/${slug}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products for category slug: ${slug}`);
      }
      return res.json();
    },
  });
}

export function useCreateProduct() {
  return useMutation<Product, Error, InsertProduct>({
    mutationFn: async (productData) => {
      const res = await apiRequest("POST", "/api/products", productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    }
  });
}

export function useUpdateProduct() {
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
  return useMutation<{ message: string }, Error, number>({
    mutationFn: async (id) => {
      const res = await apiRequest("DELETE", `/api/products/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    }
  });
}

// Cart API
export function useCart() {
  return useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });
}

export function useAddToCart() {
  return useMutation<CartItem, Error, Omit<InsertCartItem, 'userId'>>({
    mutationFn: async (cartItemData) => {
      console.log("cartItemData", cartItemData);
      const res = await apiRequest("POST", "/api/cart", cartItemData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    }
  });
}

export function useUpdateCartItem() {
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

// Watchlist API
export function useWatchlist() {
  return useQuery<WatchlistItemWithProduct[]>({
    queryKey: ['/api/watchlist'],
  });
}

export function useAddToWatchlist() {
  return useMutation<WatchlistItem, Error, Omit<InsertWatchlistItem, 'userId'>>({
    mutationFn: async (watchlistItemData) => {
      const res = await apiRequest("POST", "/api/watchlist", watchlistItemData);
      if (!res.ok) {
        const error = await res.json();
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
  });
}

export function useOrder(id: number) {
  return useQuery<OrderWithItems>({
    queryKey: ['/api/orders', id],
    enabled: !!id,
  });
}

export function useCreateOrder() {
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
  });
}

export function useBanner(id: number) {
  return useQuery<Banner>({
    queryKey: ['/api/banners', id],
    enabled: !!id,
  });
}

export function useCreateBanner() {
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
