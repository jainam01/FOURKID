import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, InsertUser, LoginCredentials } from "@shared/schema";

export function useUser() {
  return useQuery<User | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        
        return await res.json();
      } catch (error) {
        return null;
      }
    }
  });
}

export function useLogin() {
  return useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    }
  });
}

export function useRegister() {
  return useMutation<User, Error, InsertUser>({
    mutationFn: async (userData) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return await res.json();
    }
  });
}

export function useLogout() {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout", {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      // Also invalidate other user-specific data
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    }
  });
}

export function isAdmin(user: User | null | undefined) {
  return user?.role === "admin";
}
