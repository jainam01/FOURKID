// File: server/src/routes.ts

import { Express, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { z } from "zod";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';

import { DbStorage } from './db-storage';
import {
    loginSchema, insertUserSchema, forgotPasswordSchema, resetPasswordSchema,
    insertCategorySchema, insertProductSchema, insertCartItemSchema,
    insertWatchlistItemSchema, insertBannerSchema
} from "@shared/schema";

const storage = new DbStorage();

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Login required." });
};

// Middleware to check for admin role
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") return next();
    res.status(403).json({ message: "Forbidden: Admin access required" });
};

// This single function is exported and called by index.ts
export function registerRoutes(app: Express, transporter: nodemailer.Transporter)  {

    // --- PASSPORT STRATEGY CONFIGURATION ---
    passport.use(
        new LocalStrategy(
            { usernameField: "identifier" },
            async (identifier, password, done) => {
                try {
                    const user = await storage.login(identifier, password);
                    if (!user) {
                        return done(null, false, { message: "Incorrect email/phone or password." });
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err as Error);
                }
            }
        )
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await storage.getUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    // --- AUTHENTICATION & USER ROUTES ---

    // The one, correct login route that fixes the session issue
    app.post("/api/auth/login", async (req, res, next) => {
        try {
            const { identifier, password } = loginSchema.parse(req.body);
            const user = await storage.login(identifier, password);
            if (!user) {
                return res.status(401).json({ message: "Incorrect email/phone or password." });
            }
            req.logIn(user, (err) => {
                if (err) {
                    console.error("Session login error:", err);
                    return res.status(500).json({ message: "Failed to create a session." });
                }
                const { password: _, ...userWithoutPassword } = user;
                return res.json(userWithoutPassword);
            });
        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid login data", errors: error.flatten() });
            console.error("Login route error:", error);
            return res.status(500).json({ message: "An internal server error occurred." });
        }
    });
    
    app.post("/api/auth/register", async (req, res) => {
      try {
        const userData = insertUserSchema.parse(req.body);
        if (await storage.getUserByEmail(userData.email)) {
          return res.status(400).json({ message: "Email already registered" });
        }
        const user = await storage.createUser(userData);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      } catch (error) {
        res.status(400).json({ message: "Invalid user data", error: (error as Error).message });
      }
    });

    app.post("/api/auth/logout", (req, res) => {
      req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout failed", error: err });
        res.json({ message: "Logged out successfully" });
      });
    });

    app.get("/api/auth/me", isAuthenticated, (req, res) => {
      const { password, ...userWithoutPassword } = req.user as any;
      res.json(userWithoutPassword);
    });

    // --- PASSWORD MANAGEMENT ROUTES ---
    app.post("/api/auth/forgot-password", async (req, res) => {
        try {
            const { email } = req.body;
            const user = await storage.getUserByEmail(email);
      
            if (!user) {
                // Still send a success message to prevent email enumeration attacks
                return res.json({ message: "If a user with that email exists, a password reset link has been sent." });
            }
      
            // 1. Generate a secure token
            const resetToken = crypto.randomBytes(32).toString("hex");
            const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
      
            // 2. Set an expiration date (e.g., 1 hour from now)
            const passwordResetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
      
            // 3. Update the user in the database
            await storage.updateUser(user.id, {
                passwordResetToken,
                passwordResetTokenExpires,
            });
      
            // 4. Send the email
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            const emailBody = `
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in one hour.</p>
            `;
      
            await transporter.sendMail({
                to: user.email,
                from: process.env.SMTP_USER,
                subject: "Password Reset Request",
                html: emailBody,
            });
            
            res.json({ message: "If a user with that email exists, a password reset link has been sent." });
      
        } catch (error) {
            console.error("Forgot password error:", error);
            res.status(500).json({ message: "An error occurred." });
        }
      });

      app.post("/api/auth/reset-password", async (req, res) => {
        try {
            const { token, password } = req.body;
      
            // Hash the token from the URL to match the one in the DB
            const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
            
            const user = await storage.getUserByResetToken(hashedToken);
      
            if (!user) {
                return res.status(400).json({ message: "Token is invalid or has expired." });
            }
      
            // Update the user's password and clear the reset token fields
            await storage.updateUser(user.id, {
                password: password, // The updateUser method will hash it
                passwordResetToken: null,
                passwordResetTokenExpires: null,
            });
            
            res.json({ message: "Password has been reset successfully." });
      
        } catch (error) {
            console.error("Reset password error:", error);
            res.status(500).json({ message: "An error occurred." });
        }
      });
      
      app.put("/api/users/:id/password", isAuthenticated, async (req, res) => {
        try {
          const userIdToUpdate = Number(req.params.id);
          const loggedInUserId = (req.user as any).id;
          const userRole = (req.user as any).role;
      
          // Ensure users can only change their own password, unless they are an admin
          if (userIdToUpdate !== loggedInUserId && userRole !== 'admin') {
            return res.status(403).json({ message: "Forbidden: You can only change your own password." });
          }
      
          const passwordSchema = z.object({
            currentPassword: z.string(),
            newPassword: z.string().min(6, "New password must be at least 6 characters."),
          });
      
          const { currentPassword, newPassword } = passwordSchema.parse(req.body);
      
          // Get the user from the database to verify the current password
          const user = await storage.getUser(userIdToUpdate);
          if (!user) {
            return res.status(404).json({ message: "User not found." });
          }
      
          // Verify the current password
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
            return res.status(401).json({ message: "Incorrect current password." });
          }
      
          // If verification passes, update the user with the new, hashed password
          const updatedUser = await storage.updateUser(userIdToUpdate, { password: newPassword });
      
          if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update password." });
          }
      
          res.json({ message: "Password updated successfully." });
      
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid data", errors: error.flatten() });
          }
          console.error("Error updating password:", error);
          res.status(500).json({ message: "An error occurred while updating the password.", error: (error as Error).message });
        }
      });
    

    // --- USER PROFILE & ADMIN ROUTES ---
    app.get("/api/users", isAdmin, async (req, res) => {
        try {
            const users = (await storage.getUsers() || []).map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch users", error: (error as Error).message });
        }
    });

    app.put("/api/users/:id", isAuthenticated, async (req, res) => {
        try {
            const userIdToUpdate = Number(req.params.id);
            const loggedInUserId = (req.user as any).id;
            const userRole = (req.user as any).role;
            if (loggedInUserId !== userIdToUpdate && userRole !== 'admin') {
                return res.status(403).json({ message: "Forbidden: You can only update your own profile." });
            }
            const updateUserProfileSchema = insertUserSchema.pick({ name: true, businessName: true, phoneNumber: true, address: true, gstin: true }).partial();
            const userDataToUpdate = updateUserProfileSchema.parse(req.body);
            if (Object.keys(userDataToUpdate).length === 0) {
                return res.status(400).json({ message: "No update data provided." });
            }
            const updatedUser = await storage.updateUser(userIdToUpdate, userDataToUpdate);
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found or update failed." });
            }
            const { password, ...userWithoutPassword } = updatedUser;
            res.json(userWithoutPassword);
        } catch (error) {
            if (error instanceof z.ZodError) return res.status(400).json({ message: "Invalid data provided.", errors: error.flatten() });
            res.status(500).json({ message: "An internal server error occurred.", error: (error as Error).message });
        }
    });
    // --- CATEGORY ROUTES ---
    app.get("/api/categories", async (req, res) => {
        try {
            const categories = await storage.getCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch categories", error: (error as Error).message });
        }
    });

    app.get("/api/categories/:id", async (req, res) => {
        try {
          const category = await storage.getCategory(Number(req.params.id));
          if (!category) {
            return res.status(404).json({ message: "Category not found" });
          }
          res.json(category);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch category", error: (error as Error).message });
        }
      });

      app.get("/api/categories/slug/:slug", async (req, res) => {
        try {
          const category = await storage.getCategoryBySlug(req.params.slug);
          if (!category) {
            return res.status(404).json({ message: "Category not found" });
          }
          res.json(category);
        } catch (error) {
          console.error("Error fetching category by slug:", error);
          res.status(500).json({ message: "Failed to fetch category", error: (error as Error).message });
        }
      });
    
      app.post("/api/categories", isAdmin, async (req, res) => {
        try {
          const categoryData = insertCategorySchema.parse(req.body);
          const category = await storage.createCategory(categoryData);
          res.status(201).json(category);
        } catch (error) {
          res.status(400).json({ message: "Invalid category data", error: (error as Error).message });
        }
      });
    
      app.put("/api/categories/:id", isAdmin, async (req, res) => {
        try {
          const categoryData = insertCategorySchema.partial().parse(req.body);
          const category = await storage.updateCategory(Number(req.params.id), categoryData);
          
          if (!category) {
            return res.status(404).json({ message: "Category not found" });
          }
          
          res.json(category);
        } catch (error) {
          res.status(400).json({ message: "Invalid category data", error: (error as Error).message });
        }
      });
    
      app.delete("/api/categories/:id", isAdmin, async (req, res) => {
        try {
          const result = await storage.deleteCategory(Number(req.params.id));
          
          if (!result) {
            return res.status(404).json({ message: "Category not found" });
          }
          
          res.json({ message: "Category deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to delete category", error: (error as Error).message });
        }
      });
    // Add other category routes (GET by ID, POST, PUT, DELETE) here...

    // --- PRODUCT ROUTES ---
    app.get("/api/products", async (req, res) => {
        try {
          const products = await storage.getProductsWithDetails();
          res.json(products);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
        }
      });
    
      app.get("/api/products/:id", async (req, res) => {
        try {
          const product = await storage.getProductWithDetails(Number(req.params.id));
          
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          
          res.json(product);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch product", error: (error as Error).message });
        }
      });
    
      app.get("/api/products/category/:categoryId", async (req, res) => {
        try {
          const products = await storage.getProductsByCategory(Number(req.params.categoryId));
          res.json(products);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
        }
      });
    
      app.get("/api/products/category-slug/:slug", async (req, res) => {
        try {
          const products = await storage.getProductsByCategorySlug(req.params.slug);
          res.json(products);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
        }
      });
    
      app.post("/api/products", isAdmin, async (req, res) => {
        try {
          const productData = insertProductSchema.parse(req.body);
          const product = await storage.createProduct(productData);
          res.status(201).json(product);
        } catch (error) {
          res.status(400).json({ message: "Invalid product data", error: (error as Error).message });
        }
      });
    
      app.put("/api/products/:id", isAdmin, async (req, res) => {
        try {
          const productData = insertProductSchema.partial().parse(req.body);
          const product = await storage.updateProduct(Number(req.params.id), productData);
          
          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }
          
          res.json(product);
        } catch (error) {
          res.status(400).json({ message: "Invalid product data", error: (error as Error).message });
        }
      });
    
      app.delete("/api/products/:id", isAdmin, async (req, res) => {
        try {
          const result = await storage.deleteProduct(Number(req.params.id));
          
          if (!result) {
            return res.status(404).json({ message: "Product not found" });
          }
          
          res.json({ message: "Product deleted successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to delete product", error: (error as Error).message });
        }
      });
    


      app.get("/api/cart", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const cartItems = await storage.getUserCartItems(userId);
          res.json(cartItems);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch cart items", error: (error as Error).message });
        }
      });
    
      app.post("/api/cart", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const cartItemData = insertCartItemSchema.parse({ ...req.body, userId });
          const cartItem = await storage.addToCart(cartItemData);
          res.status(201).json(cartItem);
        } catch (error) {
          res.status(400).json({ message: "Invalid cart item data", error: (error as Error).message });
        }
      });
    
      app.put("/api/cart/:id", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const cartItem = await storage.getCartItem(Number(req.params.id));
          
          if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
          }
          
          if (cartItem.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: Not your cart item" });
          }
          
          const { quantity } = req.body;
          if (typeof quantity !== "number" || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
          }
          
          const updatedCartItem = await storage.updateCartItemQuantity(Number(req.params.id), quantity);
          res.json(updatedCartItem);
        } catch (error) {
          res.status(400).json({ message: "Invalid cart item data", error: (error as Error).message });
        }
      });
    
      app.delete("/api/cart/:id", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const cartItem = await storage.getCartItem(Number(req.params.id));
          
          if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
          }
          
          if (cartItem.userId !== userId) {
            return res.status(403).json({ message: "Forbidden: Not your cart item" });
          }
          
          const result = await storage.removeFromCart(Number(req.params.id));
          res.json({ message: "Cart item removed successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to remove cart item", error: (error as Error).message });
        }
      });
    
      app.delete("/api/cart", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          await storage.clearCart(userId);
          res.json({ message: "Cart cleared successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to clear cart", error: (error as Error).message });
        }
      });
    

      app.get("/api/watchlist", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const watchlistItems = await storage.getUserWatchlistItems(userId);
          res.json(watchlistItems);
        } catch (error) {
          res.status(500).json({ message: "Failed to fetch watchlist items", error: (error as Error).message });
        }
      });
    
      app.post("/api/watchlist", isAuthenticated, async (req, res) => {
        try {
          const userId = (req.user as any).id;
          const watchlistItemData = insertWatchlistItemSchema.parse({ ...req.body, userId });
    
          const isInWatchlist = await storage.isInWatchlist(userId, watchlistItemData.productId);
          if (isInWatchlist) {
            return res.status(409).json({ message: "Product already in watchlist" });
          }
    
          const watchlistItem = await storage.addToWatchlist(watchlistItemData);
          res.status(201).json(watchlistItem);
        } catch (error: unknown) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid watchlist item data", errors: error.flatten() });
          }
          console.error("Error adding to watchlist:", error);
          res.status(500).json({ message: "Failed to add to watchlist", error: (error as Error).message });
        }
      });
    
      app.delete("/api/watchlist/:id", isAuthenticated, async (req, res) => {
        try {
          const result = await storage.removeFromWatchlist(Number(req.params.id));
          
          if (!result) {
            return res.status(404).json({ message: "Watchlist item not found" });
          }
          
          res.json({ message: "Watchlist item removed successfully" });
        } catch (error) {
          res.status(500).json({ message: "Failed to remove watchlist item", error: (error as Error).message });
        }
      });
    
    // Banner routes
  app.get("/api/banners", async (req, res) => {
    try {
      const type = req.query.type as string | undefined;
      
      let banners;
      if (type) {
        banners = await storage.getBannersByType(type);
      } else {
        banners = await storage.getBanners();
      }
      
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners", error: (error as Error).message });
    }
  });

  app.get("/api/banners/:id", async (req, res) => {
    try {
      const banner = await storage.getBanner(Number(req.params.id));
      
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banner", error: (error as Error).message });
    }
  });

  app.post("/api/banners", isAdmin, async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      res.status(400).json({ message: "Invalid banner data", error: (error as Error).message });
    }
  });

  app.put("/api/banners/:id", isAdmin, async (req, res) => {
    try {
      const bannerData = insertBannerSchema.partial().parse(req.body);
      const banner = await storage.updateBanner(Number(req.params.id), bannerData);
      
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      
      res.json(banner);
    } catch (error) {
      res.status(400).json({ message: "Invalid banner data", error: (error as Error).message });
    }
  });

  app.delete("/api/banners/:id", isAdmin, async (req, res) => {
    try {
      const result = await storage.deleteBanner(Number(req.params.id));
      
      if (!result) {
        return res.status(404).json({ message: "Banner not found" });
      }
      
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner", error: (error as Error).message });
    }
  });

    // Add other watchlist routes here...
    
    // --- ORDER ROUTES ---
    app.get("/api/orders", isAuthenticated, async (req, res) => {
        try {
            const userId = (req.user as any).id;
            const userRole = (req.user as any).role;
            const orders = userRole === "admin"
                ? await storage.getOrdersWithItems()
                : await storage.getUserOrdersWithItems(userId);
            res.json(orders);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch orders", error: error.message });
        }
    });

    app.post("/api/orders/manual-upi", isAuthenticated, async (req, res) => {
        try {
            const userId = (req.user as any).id;
            const order = await storage.createOrderFromCart(userId);
            if (!order) return res.status(400).json({ message: "Cart is empty." });
            res.status(201).json(order);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to create order", error: error.message });
        }
    });

    
app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const order = await storage.getOrderWithItems(Number(req.params.id));
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      
      if (userRole !== "admin" && order.userId !== userId) {
        return res.status(403).json({ message: "Forbidden: Not your order" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order", error: (error as Error).message });
    }
  });
  
  
  
  app.put("/api/orders/:id/status", isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const order = await storage.updateOrderStatus(Number(req.params.id), status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order status", error: (error as Error).message });
    }
  });

    app.put("/api/admin/orders/:id/verify", isAdmin, async (req, res) => {
        try {
            const orderId = Number(req.params.id);
            const { approved } = req.body;
            const newStatus = approved ? 'processing' : 'payment rejected';
            const order = await storage.updateOrderStatus(orderId, newStatus);
            if (!order) return res.status(404).json({ message: "Order not found." });
            res.json(order);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to verify payment", error: error.message });
        }
    });
    // Add other order routes here...

    // --- SETTINGS ROUTES ---
    app.get('/api/settings/upi', async (req, res) => {
        try {
            const upiDetails = await storage.getUpiSettings();
            res.json(upiDetails);
        } catch (error) {
            res.status(500).json({ message: "Failed to get UPI settings", error: (error as Error).message });
        }
    });

    app.put('/api/admin/settings/upi', isAdmin, async (req, res) => {
        try {
            const { upiId, qrCodeUrl } = req.body;
            const updatedSettings = await storage.updateUpiSettings({ upiId, qrCodeUrl });
            res.json(updatedSettings);
        } catch (error) {
            res.status(500).json({ message: "Failed to update UPI settings", error: (error as Error).message });
        }
    });

    // --- REVIEW ROUTES ---
    app.get("/api/admin/reviews", isAdmin, async (req, res) => {
        try {
            const reviews = await storage.getReviewsForAdmin();
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: "Failed to fetch reviews", error: (error as Error).message });
        }
    });

    app.post("/api/reviews", isAuthenticated, async (req, res) => {
        console.log("Received review POST", req.body);
        try {
          const userId = (req.user as any).id;
          
          // Validate the incoming review data
          const reviewSchema = z.object({
            productId: z.number(),
            rating: z.number().min(1).max(5),
            comment: z.string().min(1, "Comment cannot be empty."),
          });
          const reviewData = reviewSchema.parse(req.body);
    
          // Create the review in the database with a 'pending' status
          const newReview = await storage.createReview({
            ...reviewData,
            userId,
            status: 'pending' // All new reviews must be approved by an admin
          });
          
          res.status(201).json({ message: "Review submitted successfully and is pending approval." });
    
        } catch (error) {
          if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid review data", errors: error.flatten() });
          }
          console.error("Error submitting review:", error);
          res.status(500).json({ message: "Failed to submit review", error: (error as Error).message });
        }
      });
    
      // GET /api/admin/reviews - Allows an admin to get all reviews with user/product details.
      app.get("/api/admin/reviews", isAdmin, async (req, res) => {
        try {
          const reviews = await storage.getReviewsForAdmin();
          res.json(reviews);
        } catch (error) {
          console.error("Error fetching admin reviews:", error);
          res.status(500).json({ message: "Failed to fetch reviews", error: (error as Error).message });
        }
      });
    
      // PUT /api/admin/reviews/:id/approve - Allows an admin to approve a pending review.
      app.put("/api/admin/reviews/:id/approve", isAdmin, async (req, res) => {
        try {
          const reviewId = Number(req.params.id);
          const updatedReview = await storage.updateReviewStatus(reviewId, 'approved');
    
          if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
          }
    
          res.json({ message: "Review approved successfully." });
        } catch (error) {
          console.error("Error approving review:", error);
          res.status(500).json({ message: "Failed to approve review", error: (error as Error).message });
        }
      });
    
      // DELETE /api/admin/reviews/:id - Allows an admin to delete a review.
      app.delete("/api/admin/reviews/:id", isAdmin, async (req, res) => {
        try {
          const reviewId = Number(req.params.id);
          const result = await storage.deleteReview(reviewId);
    
          if (!result) {
            return res.status(404).json({ message: "Review not found or already deleted." });
          }
    
          res.json({ message: "Review deleted successfully." });
        } catch (error) {
          console.error("Error deleting review:", error);
          res.status(500).json({ message: "Failed to delete review", error: (error as Error).message });
        }
      });
    
      app.get("/api/products/:id/reviews", async (req, res) => {
        try {
          const productId = Number(req.params.id);
          if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID." });
          }
    
          // This calls the new method in your DbStorage
          const reviews = await storage.getApprovedReviewsForProduct(productId);
          
          res.json(reviews);
        } catch (error) {
          console.error(`Error fetching reviews for product ${req.params.id}:`, error);
          res.status(500).json({ message: "Failed to fetch reviews", error: (error as Error).message });
        }
      });
    
    
    

      app.post("/api/support",isAuthenticated, async (req, res) => {
        try {
          console.log('Request received:', req.body); // Debug log
          const { name, email, subject, message } = req.body;
    
          if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
          }
    
          if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.error('SMTP credentials not configured');
            return res.status(500).json({ message: "Email service not configured" });
          }
    
          const mailOptions = {
            from: `"${name}"`,
            to: process.env.SMTP_USER,
            replyTo: email,
            subject: `Support Request: ${subject}`,
            html: `
              <h2>New Support Request</h2>
              <p><strong>From:</strong> ${name} (${email})</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `
          };
    
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
          res.json({ message: "Support request submitted successfully" });
        } catch (error) {
          console.error('Detailed error:', error);
          res.status(500).json({ 
            message: "Failed to submit support request", 
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });
    
     

    app.post("/api/wholesale-application",isAuthenticated, async (req, res) => {
        console.log('Received wholesale application request');
        console.log('Request body:', req.body);
        
        try {
          const { fullName, businessEmail, companyName, gstNumber, productTypes, catalogFile } = req.body;
    
          // Validate required fields
          if (!fullName || !businessEmail || !companyName || !gstNumber || !productTypes) {
            console.log('Missing required fields:', { fullName, businessEmail, companyName, gstNumber, productTypes });
            return res.status(400).json({ 
              message: "Missing required fields",
              details: { fullName, businessEmail, companyName, gstNumber, productTypes }
            });
          }
    
          // Validate SMTP configuration
          if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            console.error('SMTP configuration missing:', {
              SMTP_USER: !!process.env.SMTP_USER,
              SMTP_PASSWORD: !!process.env.SMTP_PASSWORD
            });
            return res.status(500).json({ message: "Email service not properly configured" });
          }
    
          const mailOptions = {
            from: `"${fullName}" <${businessEmail}>`,
            to: process.env.SMTP_USER,
            replyTo: businessEmail,
            subject: "New Wholesale Application",
            html: `
              <h2>New Wholesale Application Received</h2>
              <p><strong>Full Name:</strong> ${fullName}</p>
              <p><strong>Business Email:</strong> ${businessEmail}</p>
              <p><strong>Company Name:</strong> ${companyName}</p>
              <p><strong>GST Number:</strong> ${gstNumber}</p>
              <p><strong>Product Categories:</strong> ${productTypes}</p>
              ${catalogFile ? `<p><strong>Catalog Link:</strong> ${catalogFile}</p>` : ''}
            `
          };
    
          console.log('Attempting to send email with configuration:', {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
          });
    
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
          res.status(200).json({ message: "Application submitted successfully" });
        } catch (error) {
          console.error("Error processing wholesale application:", error);
          res.status(500).json({ 
            message: "Failed to process application",
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      });
    
      app.post("/api/newsletter-subscribe", isAuthenticated, async (req, res) => {
        try {
          const { email } = req.body;
          if (!email || !email.includes('@')) {
            return res.status(400).json({ message: "Invalid email address." });
          }
    
          if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            return res.status(500).json({ message: "Email service not configured." });
          }
    
          const mailOptions = {
            from: `"Newsletter Signup" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            subject: "New Newsletter Subscription",
            html: `<p>New newsletter subscription from: <strong>${email}</strong></p>`
          };
    
          await transporter.sendMail(mailOptions);
          res.json({ message: "Subscription email sent to admin." });
        } catch (error) {
          res.status(500).json({ message: "Failed to send subscription email.", error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });
    
      app.post("/api/submit-contact-form", isAuthenticated, async (req, res) => {
        try {
          const { name, email, subject, message } = req.body;
    
          if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required." });
          }
    
          if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
            return res.status(500).json({ message: "Email service not configured." });
          }
    
          const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.SMTP_USER,
            subject: `Contact Form: ${subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `
          };
    
          await transporter.sendMail(mailOptions);
          res.json({ message: "Your message has been sent successfully." });
        } catch (error) {
          res.status(500).json({ message: "Failed to send your message.", error: error instanceof Error ? error.message : 'Unknown error' });
        }
      });
    
}