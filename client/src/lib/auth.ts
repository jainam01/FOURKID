import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { User, InsertUser, LoginCredentials,ForgotPasswordCredentials, ResetPasswordCredentials } from "@shared/schema";


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

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/auth/me'], user);
    },
  });
};


export const useForgotPassword = () => {
  return useMutation<{ message: string }, Error, ForgotPasswordCredentials>({
      mutationFn: async (credentials) => {
          const res = await apiRequest("POST", "/api/auth/forgot-password", credentials);
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.message || 'Failed to send reset link.');
          }
          return res.json();
      },
  });
};


export const useResetPassword = () => {
  return useMutation<{ message: string }, Error, ResetPasswordCredentials>({
      mutationFn: async (credentials) => {
          const res = await apiRequest("POST", "/api/auth/reset-password", credentials);
          if (!res.ok) {
              const error = await res.json();
              throw new Error(error.message || 'Failed to reset password.');
          }
          return res.json();
      },
  });
};

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
      // Explicitly clear cart data in cache on logout
      queryClient.setQueryData(['/api/cart'], []);
      queryClient.invalidateQueries({ queryKey: ['/api/watchlist'] });
      // Explicitly clear watchlist data in cache on logout
      queryClient.setQueryData(['/api/watchlist'], []);
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    }
  });
}

export function isAdmin(user: User | null | undefined) {
  return user?.role === "admin";
}

