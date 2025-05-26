import express, { Request, Response, NextFunction } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { DbStorage } from "./db-storage";
import { loginSchema, insertUserSchema, insertProductSchema, insertCategorySchema, insertCartItemSchema, insertWatchlistItemSchema, insertOrderSchema, insertBannerSchema } from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);
const storage = new DbStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fourkids-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      },
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
        max: 1000 // maximum number of sessions
      })
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          console.log('Attempting login for email:', email);
          const user = await storage.getUserByEmail(email);
          if (!user) {
            console.log('User not found:', email);
            return done(null, false, { message: "Incorrect email." });
          }
          if (user.password !== password) {
            console.log('Invalid password for user:', email);
            return done(null, false, { message: "Incorrect password." });
          }
          console.log('Login successful for user:', email);
          return done(null, user);
        } catch (err) {
          console.error('Login error:', err);
          return done(err);
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

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden: Admin access required" });
  };

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const user = await storage.createUser(userData);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: (error as Error).message });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      const credentials = loginSchema.parse(req.body);
      
      passport.authenticate("local", (err: Error, user: any, info: { message: string }) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ message: "Authentication failed", error: err.message });
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        req.logIn(user, (err) => {
          if (err) {
            console.error('Session error:', err);
            return res.status(500).json({ message: "Session creation failed", error: err.message });
          }
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      console.error('Login validation error:', error);
      res.status(400).json({ message: "Invalid login data", error: (error as Error).message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed", error: err });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      // Remove password from response
      const { password, ...userWithoutPassword } = req.user as any;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Category routes
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

  // Product routes
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

  // Cart routes
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

  // Watchlist routes
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
      const watchlistItem = await storage.addToWatchlist(watchlistItemData);
      res.status(201).json(watchlistItem);
    } catch (error) {
      res.status(400).json({ message: "Invalid watchlist item data", error: (error as Error).message });
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

  // Order routes
  app.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userRole = (req.user as any).role;
      
      let orders;
      if (userRole === "admin") {
        orders = await storage.getOrdersWithItems();
      } else {
        orders = await storage.getUserOrdersWithItems(userId);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders", error: (error as Error).message });
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

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const { items, ...orderData } = req.body;
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Order must have at least one item" });
      }
      
      const parsedOrderData = insertOrderSchema.parse({ ...orderData, userId });
      
      // Create the order
      const order = await storage.createOrder(parsedOrderData, items);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error: (error as Error).message });
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

  // User routes for admin
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = Array.from((await storage.getUsers() || []) as any[]).map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
