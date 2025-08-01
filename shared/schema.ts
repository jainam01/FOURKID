// File: shared/schema.ts

import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ReactNode } from "react";
import { z } from "zod";


export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value"),
});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  gstin: text("gstin"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  passwordResetToken: text("password_reset_token").unique(),
  passwordResetTokenExpires: timestamp("password_reset_token_expires"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});
export type ForgotPasswordCredentials = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});
export type ResetPasswordCredentials = z.infer<typeof resetPasswordSchema>;

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });

// Category model
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sku: text("sku").notNull().unique(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull(),
  images: jsonb("images").notNull().$type<string[]>(),
  categoryId: integer("category_id").notNull(),
  variants: jsonb("variants").$type<ProductVariant[] | null | undefined>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });

// Order model
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  status: text("status").default("pending payment").notNull(),
  total: doublePrecision("total").notNull(),
  address: text("address").notNull(),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });

// Order Item model
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
  variantInfo: jsonb("variant_info").$type<ProductVariant[] | null>(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true, orderId: true });

// Cart model
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  variantInfo: jsonb("variant_info").$type<ProductVariant[] | null | undefined>()
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });

// Watchlist model
export const watchlistItems = pgTable("watchlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
});

export const insertWatchlistItemSchema = createInsertSchema(watchlistItems).omit({ id: true });

// Banner model
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  desktopImage: text("desktop_image").notNull(),
  mobileImage: text("mobile_image").notNull(),
  link: text("link"),
  type: text("type").notNull(), // hero, promotion, etc.
  active: boolean("active").default(true).notNull(),
  position: integer("position").default(0).notNull(),
});

export const insertBannerSchema = createInsertSchema(banners).omit({ id: true });

// Review model
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  status: text("status").default("pending").notNull(), // 'pending' | 'approved'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type WatchlistItem = typeof watchlistItems.$inferSelect;
export type InsertWatchlistItem = z.infer<typeof insertWatchlistItemSchema>;

export type Banner = typeof banners.$inferSelect;
export type InsertBanner = z.infer<typeof insertBannerSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Additional types
export interface ProductVariant {
  map(arg0: (v: any) => string): unknown;
  name: string; // e.g., "Size", "Color"
  value: string; // e.g., "XL", "Red"
}

export interface ProductWithDetails extends Product {
  // businessName: string;
  category: Category;
}

export interface CartItemWithProduct extends CartItem {
 product: Product;
}

export interface WatchlistItemWithProduct extends WatchlistItem {
  product: Product;
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { product: Product })[];
  user?: User;
}

export interface ReviewWithDetails extends Review {
  user: User;
  product: Product;
}

// Admin-specific review interface with moderation status
export interface AdminReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
  status: 'pending' | 'approved';
  user: Pick<User, 'id' | 'name' | 'email'>;
  product: Pick<Product, 'id' | 'name'>;
}

export const userSessions = pgTable("user_sessions", {
  sid: text("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire", { mode: 'date' }).notNull(),
});

// Login schema
export const loginSchema = z.object({
  // We rename 'email' to 'identifier' to be more generic
  identifier: z.string().min(3, { message: "Email or Phone Number is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});
export type LoginCredentials = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, { message: "Invalid phone number" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});
export type RegisterCredentials = z.infer<typeof registerSchema>;

export const createOrderInputSchema = z.object({
  paymentIntentId: z.string(),
});

