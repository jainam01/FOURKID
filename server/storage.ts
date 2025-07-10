import {
  users, User, InsertUser,
  categories, Category, InsertCategory,
  products, Product, InsertProduct,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  cartItems, CartItem, InsertCartItem,
  watchlistItems, WatchlistItem, InsertWatchlistItem,
  banners, Banner, InsertBanner,
  ProductWithDetails, CartItemWithProduct, WatchlistItemWithProduct, OrderWithItems,
  ProductVariant
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProductsWithDetails(): Promise<ProductWithDetails[]>;
  getProductsByCategory(categoryId: number): Promise<Product[]>;
  getProductsByCategorySlug(slug: string): Promise<ProductWithDetails[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductWithDetails(id: number): Promise<ProductWithDetails | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(): Promise<Order[]>;
  getOrdersWithItems(): Promise<OrderWithItems[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getUserOrdersWithItems(userId: number): Promise<OrderWithItems[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrderWithItems(id: number): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Cart operations
  getUserCartItems(userId: number): Promise<CartItemWithProduct[]>;
  getCartItem(id: number): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Watchlist operations
  getUserWatchlistItems(userId: number): Promise<WatchlistItemWithProduct[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(id: number): Promise<boolean>;
  isInWatchlist(userId: number, productId: number): Promise<boolean>;
  
  // Banner operations
  getBanners(): Promise<Banner[]>;
  getBannersByType(type: string): Promise<Banner[]>;
  getBanner(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private categoriesData: Map<number, Category>;
  private productsData: Map<number, Product>;
  private ordersData: Map<number, Order>;
  private orderItemsData: Map<number, OrderItem>;
  private cartItemsData: Map<number, CartItem>;
  private watchlistItemsData: Map<number, WatchlistItem>;
  private bannersData: Map<number, Banner>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private cartItemIdCounter: number;
  private watchlistItemIdCounter: number;
  private bannerIdCounter: number;
  
  constructor() {
    this.usersData = new Map();
    this.categoriesData = new Map();
    this.productsData = new Map();
    this.ordersData = new Map();
    this.orderItemsData = new Map();
    this.cartItemsData = new Map();
    this.watchlistItemsData = new Map();
    this.bannersData = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.watchlistItemIdCounter = 1;
    this.bannerIdCounter = 1;
    
    // Initialize with some data
    this.seedData();
  }
  
  private seedData() {
    // Add an admin user
    this.createUser({
      name: "Admin",
      businessName: "Fourkids",
      email: "admin@fourkids.com",
      password: "admin123",
      phoneNumber: "1234567890",
      address: "Admin Office, New Delhi",
      role: "admin"
    });

    // Add sample products
    const sampleProducts = [
      {
        name: "Premium Cargo Pants",
        description: "Stylish cargo pants with multiple pockets and comfortable fit.",
        sku: "CARGO-001",
        price: 899.00,
        stock: 100,
        categoryId: 2,
        images: ["https://i.ibb.co/N9Hk6Zd/cargo1.jpg"],
        variants: [{ name: "Color", value: "Black" }]
      },
      {
        name: "Classic Capri",
        description: "Comfortable capri pants perfect for summer.",
        sku: "CAPRI-001",
        price: 699.00,
        stock: 80,
        categoryId: 1,
        images: ["https://i.ibb.co/K6cw0rW/cargo2.jpg"],
        variants: [{ name: "Color", value: "Blue" }]
      },
      {
        name: "Trendy Mom Fit",
        description: "Stylish and comfortable mom fit jeans.",
        sku: "MOM-001",
        price: 999.00,
        stock: 60,
        categoryId: 3,
        images: ["https://i.ibb.co/vHnZWLB/cargo3.jpg"],
        variants: [{ name: "Color", value: "Denim" }]
      },
      {
        name: "Regular Fit Pants",
        description: "Classic regular fit pants for everyday wear.",
        sku: "REG-001",
        price: 799.00,
        stock: 120,
        categoryId: 4,
        images: ["https://i.ibb.co/N9Hk6Zd/cargo1.jpg"],
        variants: [{ name: "Color", value: "Grey" }]
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
    
    // Add some categories
    const categories = [
      { name: "Capri", description: "Stylish capri pants", slug: "capri" },
      { name: "Cargo", description: "Durable cargo pants", slug: "cargo" },
      { name: "Momfit", description: "Comfortable momfit pants", slug: "momfit" },
      { name: "Pants", description: "Regular pants collection", slug: "pants" },
      { name: "T-Shirts", description: "Casual t-shirts", slug: "t-shirts" },
      { name: "Shirts", description: "Formal shirts", slug: "shirts" }
    ];
    
    categories.forEach(cat => this.createCategory(cat));
    
    // Add some banners
    const heroBanners = [
      {
        title: "Summer Collection",
        description: "Check out our new summer collection",
        image: "https://pixabay.com/get/g052aac6748570b1bfbeb2af06756ccb689fa8668bd09ef124c4752790f66024dc0d8fb9cc1fb6712cfdded25f34d1f0449685876b7e6a4bab211998f3ae7dc82_1280.jpg",
        link: "/category/t-shirts",
        type: "hero",
        active: true,
        position: 1
      },
      {
        title: "Trendy Pants",
        description: "Latest styles in pants collection",
        image: "https://pixabay.com/get/g9432b4e984217bded52ca3650f4c11902771885f65ad9e75dd9584e62148a8fa3ec1f2fce092671cbd44264a1f60b41db3396a3aea0bf6985a3a1e701b128016_1280.jpg",
        link: "/category/pants",
        type: "hero",
        active: true,
        position: 2
      }
    ];
    
    heroBanners.forEach(banner => this.createBanner(banner));
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(user => user.email === email);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { 
      ...userData, 
      id, 
      createdAt,
      gstin: userData.gstin ?? null,
      role: userData.role ?? 'user',
      email: userData.email,
      name: userData.name,
      businessName: userData.businessName,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      address: userData.address
    };
    this.usersData.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.usersData.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.usersData.set(id, updatedUser);
    return updatedUser;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categoriesData.values());
  }
  
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesData.get(id);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesData.values()).find(category => category.slug === slug);
  }
  
  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { 
      ...categoryData, 
      id,
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description ?? null
    };
    this.categoriesData.set(id, category);
    return category;
  }
  
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categoriesData.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryData };
    this.categoriesData.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categoriesData.delete(id);
  }
  
  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.productsData.values());
  }
  
  async getProductsWithDetails(): Promise<ProductWithDetails[]> {
    return Array.from(this.productsData.values()).map(product => {
      const category = this.categoriesData.get(product.categoryId);
      return { ...product, category: category! };
    });
  }
  
  async getProductsByCategory(categoryId: number): Promise<Product[]> {
    return Array.from(this.productsData.values()).filter(product => product.categoryId === categoryId);
  }
  
  async getProductsByCategorySlug(slug: string): Promise<ProductWithDetails[]> {
    const category = await this.getCategoryBySlug(slug);
    if (!category) return [];
    
    return Array.from(this.productsData.values())
      .filter(product => product.categoryId === category.id)
      .map(product => ({ ...product, category }));
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsData.get(id);
  }
  
  async getProductWithDetails(id: number): Promise<ProductWithDetails | undefined> {
    const product = this.productsData.get(id);
    if (!product) return undefined;
    
    const category = this.categoriesData.get(product.categoryId);
    if (!category) return undefined;
    
    return { ...product, category };
  }
  
  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const createdAt = new Date();
    const product: Product = { 
      ...productData, 
      id, 
      createdAt,
      name: productData.name,
      categoryId: productData.categoryId,
      description: productData.description ?? null,
      sku: productData.sku,
      price: productData.price,
      stock: productData.stock,
      images: productData.images as string[],
      variants: productData.variants as ProductVariant[] | null
    };
    this.productsData.set(id, product);
    return product;
  }
  
  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.productsData.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { 
      ...product, 
      ...productData,
      images: productData.images as string[] | undefined ?? product.images,
      variants: productData.variants as ProductVariant[] | null | undefined ?? product.variants
    };
    this.productsData.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.productsData.delete(id);
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.ordersData.values());
  }
  
  async getOrdersWithItems(): Promise<OrderWithItems[]> {
    return Array.from(this.ordersData.values()).map(order => {
      const items = Array.from(this.orderItemsData.values())
        .filter(item => item.orderId === order.id)
        .map(item => {
          const product = this.productsData.get(item.productId)!;
          return { ...item, product };
        });
      
      return { ...order, items };
    });
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.ordersData.values()).filter(order => order.userId === userId);
  }
  
  async getUserOrdersWithItems(userId: number): Promise<OrderWithItems[]> {
    return Array.from(this.ordersData.values())
      .filter(order => order.userId === userId)
      .map(order => {
        const items = Array.from(this.orderItemsData.values())
          .filter(item => item.orderId === order.id)
          .map(item => {
            const product = this.productsData.get(item.productId)!;
            return { ...item, product };
          });
        
        return { ...order, items };
      });
  }
  
  async getOrder(id: number): Promise<Order | undefined> {
    return this.ordersData.get(id);
  }
  
  async getOrderWithItems(id: number): Promise<OrderWithItems | undefined> {
    const order = this.ordersData.get(id);
    if (!order) return undefined;
    
    const items = Array.from(this.orderItemsData.values())
      .filter(item => item.orderId === order.id)
      .map(item => {
        const product = this.productsData.get(item.productId)!;
        return { ...item, product };
      });
    
    return { ...order, items };
  }
  
  async createOrder(orderData: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const orderId = this.orderIdCounter++;
    const createdAt = new Date();
    const order: Order = { 
      ...orderData, 
      id: orderId, 
      createdAt,
      address: orderData.address,
      userId: orderData.userId,
      total: orderData.total,
      paymentIntentId: orderData.paymentIntentId ?? null, 
      status: orderData.status ?? 'pending'
    };
    this.ordersData.set(orderId, order);
    
    // Create order items
    items.forEach(item => {
      const orderItemId = this.orderItemIdCounter++;
      const orderItem: OrderItem = { 
        ...item, 
        id: orderItemId, 
        orderId,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        variantInfo: item.variantInfo ?? null
      };
      this.orderItemsData.set(orderItemId, orderItem);
      
      // Update product stock
      const product = this.productsData.get(item.productId);
      if (product) {
        const updatedStock = Math.max(0, product.stock - item.quantity);
        this.productsData.set(product.id, { ...product, stock: updatedStock });
      }
    });
    
    // Clear cart
    this.clearCart(orderData.userId);
    
    return order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.ordersData.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.ordersData.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Cart methods
  async getUserCartItems(userId: number): Promise<CartItemWithProduct[]> {
    return Array.from(this.cartItemsData.values())
      .filter(item => item.userId === userId)
      .map(item => {
        const product = this.productsData.get(item.productId)!;
        return { ...item, product };
      });
  }
  
  async getCartItem(id: number): Promise<CartItem | undefined> {
    return this.cartItemsData.get(id);
  }
  
  async addToCart(itemData: InsertCartItem): Promise<CartItem> {
    // Check if this product+variant is already in the cart
    const existingItem = Array.from(this.cartItemsData.values()).find(
      item => item.userId === itemData.userId && 
             item.productId === itemData.productId &&
             JSON.stringify(item.variantInfo) === JSON.stringify(itemData.variantInfo)
    );
    
    if (existingItem) {
      // Update quantity instead of creating new item
      const updatedQuantity = existingItem.quantity + itemData.quantity;
      return (await this.updateCartItemQuantity(existingItem.id, updatedQuantity))!;
    }
    
    const id = this.cartItemIdCounter++;
    const cartItem: CartItem = { 
      ...itemData, 
      id,
      userId: itemData.userId,
      productId: itemData.productId,
      quantity: itemData.quantity,
      variantInfo: itemData.variantInfo as ProductVariant[] | null | undefined ?? null
    };
    this.cartItemsData.set(id, cartItem);
    return cartItem;
  }
  
  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemsData.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItemsData.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItemsData.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = Array.from(this.cartItemsData.values()).filter(item => item.userId === userId);
    
    for (const item of userCartItems) {
      this.cartItemsData.delete(item.id);
    }
    
    return true;
  }
  
  // Watchlist methods
  async getUserWatchlistItems(userId: number): Promise<WatchlistItemWithProduct[]> {
    return Array.from(this.watchlistItemsData.values())
      .filter(item => item.userId === userId)
      .map(item => {
        const product = this.productsData.get(item.productId)!;
        return { ...item, product };
      });
  }
  
  async addToWatchlist(itemData: InsertWatchlistItem): Promise<WatchlistItem> {
    // Check if already in watchlist
    const exists = await this.isInWatchlist(itemData.userId, itemData.productId);
    if (exists) {
      const existingItem = Array.from(this.watchlistItemsData.values()).find(
        item => item.userId === itemData.userId && item.productId === itemData.productId
      )!;
      return existingItem;
    }
    
    const id = this.watchlistItemIdCounter++;
    const watchlistItem: WatchlistItem = { ...itemData, id };
    this.watchlistItemsData.set(id, watchlistItem);
    return watchlistItem;
  }
  
  async removeFromWatchlist(id: number): Promise<boolean> {
    return this.watchlistItemsData.delete(id);
  }
  
  async isInWatchlist(userId: number, productId: number): Promise<boolean> {
    return Array.from(this.watchlistItemsData.values()).some(
      item => item.userId === userId && item.productId === productId
    );
  }
  
  // Banner methods
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.bannersData.values());
  }
  
  async getBannersByType(type: string): Promise<Banner[]> {
    return Array.from(this.bannersData.values())
      .filter(banner => banner.type === type && banner.active)
      .sort((a, b) => a.position - b.position);
  }
  
  async getBanner(id: number): Promise<Banner | undefined> {
    return this.bannersData.get(id);
  }
  
  async createBanner(bannerData: InsertBanner): Promise<Banner> {
    const id = this.bannerIdCounter++;
    const banner: Banner = { 
      ...bannerData, 
      id,
      type: bannerData.type,
      title: bannerData.title,
      image: bannerData.image,
      link: bannerData.link ?? null,
      description: bannerData.description ?? null,
      active: bannerData.active ?? true,
      position: bannerData.position ?? 0
    };
    this.bannersData.set(id, banner);
    return banner;
  }
  
  async updateBanner(id: number, bannerData: Partial<InsertBanner>): Promise<Banner | undefined> {
    const banner = this.bannersData.get(id);
    if (!banner) return undefined;
    
    const updatedBanner = { ...banner, ...bannerData };
    this.bannersData.set(id, updatedBanner);
    return updatedBanner;
  }
  
  async deleteBanner(id: number): Promise<boolean> {
    return this.bannersData.delete(id);
  }
}

export const storage = new MemStorage();
