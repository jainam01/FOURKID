import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and } from 'drizzle-orm';
import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  cartItems, CartItem, InsertCartItem,
  watchlistItems, WatchlistItem, InsertWatchlistItem,
  banners, Banner, InsertBanner,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems
} from '@shared/schema';
import { IStorage } from './storage';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(categoryData).returning();
    return result[0];
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result.length > 0;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsWithDetails(): Promise<ProductWithDetails[]> {
    const products = await db.select().from(products);
    const categories = await db.select().from(categories);
    
    return products.map(product => ({
      ...product,
      category: categories.find(cat => cat.id === product.categoryId)!
    }));
  }

  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProductsByCategorySlug(slug: string): Promise<ProductWithDetails[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    
    const products = await db.select().from(products).where(eq(products.categoryId, category.id));
    return products.map(product => ({
      ...product,
      category
    }));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductWithDetails(id: number): Promise<ProductWithDetails | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;
    
    const category = await this.getCategory(product.categoryId);
    if (!category) return undefined;
    
    return {
      ...product,
      category
    };
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(productData).returning();
    return result[0];
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Cart operations
  async getUserCartItems(userId: number): Promise<CartItemWithProduct[]> {
    const cartItems = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    const products = await db.select().from(products);
    
    return cartItems.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    }));
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return result[0];
  }

  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    const result = await db.insert(cartItems).values(itemData).returning();
    return result[0];
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const result = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return result[0];
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id)).returning();
    return result.length > 0;
  }

  async clearCart(userId: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.userId, userId)).returning();
    return result.length > 0;
  }

  // Watchlist operations
  async getUserWatchlistItems(userId: number): Promise<WatchlistItemWithProduct[]> {
    const watchlistItems = await db.select().from(watchlistItems).where(eq(watchlistItems.userId, userId));
    const products = await db.select().from(products);
    
    return watchlistItems.map(item => ({
      ...item,
      product: products.find(p => p.id === item.productId)!
    }));
  }

  async addToWatchlist(itemData: InsertWatchlistItem): Promise<WatchlistItem> {
    const result = await db.insert(watchlistItems).values(itemData).returning();
    return result[0];
  }

  async removeFromWatchlist(id: number): Promise<boolean> {
    const result = await db.delete(watchlistItems).where(eq(watchlistItems.id, id)).returning();
    return result.length > 0;
  }

  async isInWatchlist(userId: number, productId: number): Promise<boolean> {
    const result = await db.select()
      .from(watchlistItems)
      .where(and(
        eq(watchlistItems.userId, userId),
        eq(watchlistItems.productId, productId)
      ));
    return result.length > 0;
  }

  // Banner operations
  async getBanners(): Promise<Banner[]> {
    return await db.select().from(banners);
  }

  async getBannersByType(type: string): Promise<Banner[]> {
    return await db.select().from(banners).where(eq(banners.type, type));
  }

  async getBanner(id: number): Promise<Banner | undefined> {
    const result = await db.select().from(banners).where(eq(banners.id, id));
    return result[0];
  }

  async createBanner(bannerData: InsertBanner): Promise<Banner> {
    const result = await db.insert(banners).values(bannerData).returning();
    return result[0];
  }

  async updateBanner(id: number, bannerData: Partial<InsertBanner>): Promise<Banner | undefined> {
    const result = await db.update(banners)
      .set(bannerData)
      .where(eq(banners.id, id))
      .returning();
    return result[0];
  }

  async deleteBanner(id: number): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id)).returning();
    return result.length > 0;
  }

  // Order operations
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersWithItems(): Promise<OrderWithItems[]> {
    const orders = await db.select().from(orders);
    const orderItems = await db.select().from(orderItems);
    const products = await db.select().from(products);
    
    return orders.map(order => ({
      ...order,
      items: orderItems
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: products.find(p => p.id === item.productId)!
        }))
    }));
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getUserOrdersWithItems(userId: number): Promise<OrderWithItems[]> {
    const orders = await this.getUserOrders(userId);
    const orderItems = await db.select().from(orderItems);
    const products = await db.select().from(products);
    
    return orders.map(order => ({
      ...order,
      items: orderItems
        .filter(item => item.orderId === order.id)
        .map(item => ({
          ...item,
          product: products.find(p => p.id === item.productId)!
        }))
    }));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const order = await this.getOrder(id);
    if (!order) return undefined;
    
    const orderItems = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
    const products = await db.select().from(products);
    
    return {
      ...order,
      items: orderItems.map(item => ({
        ...item,
        product: products.find(p => p.id === item.productId)!
      }))
    };
  }

  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const result = await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning();
      
      await tx.insert(orderItems).values(
        items.map(item => ({
          ...item,
          orderId: order.id
        }))
      );
      
      return order;
    });
    
    return result;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }
} 