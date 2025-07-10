// File: server/src/db-storage.ts

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  cartItems, CartItem, InsertCartItem,
  watchlistItems, WatchlistItem, InsertWatchlistItem,
  banners, Banner, InsertBanner,
  reviews, InsertReview, AdminReview, Review,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems,
  ProductVariant
} from '@shared/schema';
import { IStorage } from './storage';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(-1);
  }
  console.log('Successfully connected to the database');
  done();
});

const db = drizzle(pool);

export class DbStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const result = await db.insert(users).values({ ...userData, password: hashedPassword }).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: Partial<InsertUser> = { ...userData };

    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      updateData.password = hashedPassword;
    }

    const result = await db.update(users)
      .set(updateData)
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
    const result = await db
      .select()
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));
    
    // Use a type predicate in the filter to correctly inform TypeScript
    return result
      .filter((row): row is { products: Product; categories: Category } => row.categories !== null)
      .map(row => ({
        ...row.products,
        category: row.categories
      }));
  }
  
  async getProductWithDetails(id: number): Promise<ProductWithDetails | undefined> {
    const result = await db.select()
      .from(products)
      .where(eq(products.id, id))
      .leftJoin(categories, eq(products.categoryId, categories.id));
    
    const row = result[0];
    // This check safely handles both no product found and product with no category
    if (!row || !row.categories) {
      return undefined;
    }


    return {
      ...row.products,
      category: row.categories
    };
  }


  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.categoryId, categoryId));
  }

  async getProductsByCategorySlug(slug: string): Promise<ProductWithDetails[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];

    const productList = await db.select().from(products).where(eq(products.categoryId, category.id));
    return productList.map(product => ({
      ...product,
      category
    }));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const { variants, ...rest } = productData;
    const result = await db.insert(products).values({
      ...rest,
      variants: variants ? sql`${JSON.stringify(variants)}::jsonb` : null
    }).returning();
    return result[0];
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const { variants, ...rest } = productData;
    const result = await db.update(products)
      .set({
        ...rest,
        variants: variants ? sql`${JSON.stringify(variants)}::jsonb` : undefined
      })
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
    const result = await db.select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .leftJoin(products, eq(cartItems.productId, products.id));
    
    return result
      .filter(row => row.products) 
      .map(row => ({
        ...row.cart_items,
        product: row.products!
      }));
  }

  async getCartItem(id: number): Promise<CartItem | undefined> {
    const result = await db.select().from(cartItems).where(eq(cartItems.id, id));
    return result[0];
  }

  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    const { variantInfo, ...rest } = itemData;

    const variantComparisonCondition =
      variantInfo !== undefined && variantInfo !== null
        ? sql`${cartItems.variantInfo}::jsonb = ${JSON.stringify(variantInfo)}::jsonb`
        : sql`${cartItems.variantInfo} IS NULL`;

    const existingItem = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, itemData.userId),
        eq(cartItems.productId, itemData.productId),
        variantComparisonCondition
      ));

    if (existingItem.length > 0) {
      const updatedQuantity = existingItem[0].quantity + itemData.quantity;
      const result = await db.update(cartItems)
        .set({ quantity: updatedQuantity })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return result[0];
    }

    const result = await db.insert(cartItems).values({
      ...rest,
      variantInfo: variantInfo ? sql`${JSON.stringify(variantInfo)}::jsonb` : null
    }).returning();
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
    const result = await db.select()
      .from(watchlistItems)
      .where(eq(watchlistItems.userId, userId))
      .leftJoin(products, eq(watchlistItems.productId, products.id));

    return result
      .filter(row => row.products) // Filter out items where product was deleted
      .map(row => ({
        ...row.watchlist_items,
        product: row.products!
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
    const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt));
    if (orderList.length === 0) return [];

    const orderIds = orderList.map(o => o.id);
    const itemsWithProducts = await db.select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds))
      .leftJoin(products, eq(orderItems.productId, products.id));

    const userList = await db.select().from(users);

    return orderList.map(order => {
      const relatedItems = itemsWithProducts
        .filter(i => i.order_items.orderId === order.id && i.products) // Filter for matching order and ensure product exists
        .map(i => ({
          ...i.order_items,
          product: i.products!
        }));

      return {
        ...order,
        items: relatedItems,
        user: userList.find(u => u.id === order.userId)
      };
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getUserOrdersWithItems(userId: number): Promise<OrderWithItems[]> {
    const orderList = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
    if (orderList.length === 0) return [];
    
    const orderIds = orderList.map(o => o.id);
    const itemsWithProducts = await db.select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds))
      .leftJoin(products, eq(orderItems.productId, products.id));
      
    return orderList.map(order => {
      const relatedItems = itemsWithProducts
        .filter(i => i.order_items.orderId === order.id && i.products) // Filter for matching order and ensure product exists
        .map(i => ({
          ...i.order_items,
          product: i.products!
        }));
        
      return {
        ...order,
        items: relatedItems,
      };
    });
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const orderResult = await db.select().from(orders).where(eq(orders.id, id));
    if (orderResult.length === 0) return undefined;
    const order = orderResult[0];

    const itemsWithProducts = await db.select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id))
      .leftJoin(products, eq(orderItems.productId, products.id));
      
    const user = await this.getUser(order.userId);
    
    const relatedItems = itemsWithProducts
      .filter(i => i.products) // Ensure product exists
      .map(i => ({
        ...i.order_items,
        product: i.products!
      }));

    return {
      ...order,
      items: relatedItems,
      user
    };
  }
  
  async createOrder(orderData: InsertOrder, items: Omit<InsertOrderItem, 'orderId'>[]): Promise<Order> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning();

      if (items.length > 0) {
        const itemsToInsert = items.map(item => ({
          ...item,
          orderId: order.id,
          variantInfo: item.variantInfo ? sql`${JSON.stringify(item.variantInfo)}::jsonb` : null
        }));
        await tx.insert(orderItems).values(itemsToInsert as any);
      }
      
      return order;
    });
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const result = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  // --- REVIEW OPERATIONS ---
  async createReview(data: InsertReview): Promise<any> {
    const [newReview] = await db.insert(reviews).values(data).returning();
    return newReview;
  }

  async getReviewsForAdmin(): Promise<AdminReview[]> {
    const result = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        status: reviews.status,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
        product: {
          id: products.id,
          name: products.name,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(products, eq(reviews.productId, products.id))
      .orderBy(desc(reviews.createdAt));

    return result as unknown as AdminReview[];
  }

  async getApprovedReviewsForProduct(productId: number): Promise<Partial<Review & { user: { name: string } }>[]> {
    const result = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        user: {
          name: users.name,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(and(
        eq(reviews.productId, productId),
        eq(reviews.status, 'approved')
      ))
      .orderBy(desc(reviews.createdAt));

    return result.map(r => ({ ...r, user: r.user === null ? undefined : r.user }));
  }

  async updateReviewStatus(id: number, status: 'approved' | 'pending'): Promise<any> {
    const [updatedReview] = await db
      .update(reviews)
      .set({ status })
      .where(eq(reviews.id, id))
      .returning();
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    return result.length > 0;
  }

  async login(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return undefined;
    }

    return user;
  }

  // =================================================================
  // ===================== NEW/MODIFIED ORDER LOGIC ==================
  // =================================================================

  // NEW method to create an order directly from the user's cart in a safe transaction.
  async createOrderFromCart(userId: number, paymentIntentId: string): Promise<Order | null> {
    return db.transaction(async (tx) => {
      // 1. Get user and cart items within the transaction to ensure data consistency
      const user = await tx.select().from(users).where(eq(users.id, userId)).then(res => res[0]);
      // Join cartItems with products to get price
      const cartRows = await tx.select()
        .from(cartItems)
        .where(eq(cartItems.userId, userId))
        .leftJoin(products, eq(cartItems.productId, products.id));

      // Filter out cart items with missing product (shouldn't happen, but safe)
      const currentCartItems = cartRows.filter(row => row.products).map(row => ({
        ...row.cart_items,
        product: row.products!
      }));

      if (currentCartItems.length === 0) {
        // If cart is empty, rollback transaction by returning null
        return null;
      }

      // 2. Calculate total and prepare order data
      const total = currentCartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

      const orderData: InsertOrder = {
        userId,
        total,
        status: 'processing', // Default status after payment
        address: user?.address || 'Address not provided',
        paymentIntentId, // Store the payment ID for reference
      };

      // 3. Create the order
      const [newOrder] = await tx.insert(orders).values(orderData).returning();

      // 4. Prepare order items from the cart items
      const newOrderItems = currentCartItems.map(item => ({
        orderId: newOrder.id,
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        variantInfo: item.variantInfo ? sql`${JSON.stringify(item.variantInfo)}::jsonb` as any : null,
      }));

      // 5. Insert all the new order items
      if (newOrderItems.length > 0) {
        await tx.insert(orderItems).values(newOrderItems);
      }

      // 6. Clear the user's cart now that the order is created
      await tx.delete(cartItems).where(eq(cartItems.userId, userId));

      // 7. Return the completed order
      return newOrder;
    });
  }
}