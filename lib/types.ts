export type ProductCategory =
  | "Maxi Dresses"
  | "Evening Gowns"
  | "Casual Dresses"
  | "Festive Wear"
  | "Workwear";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number | null;
  category: ProductCategory | string;
  sizes: string[];
  colors: string[];
  stock: number;
  description: string;
  fabric: string;
  careInstructions: string;
  images: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  isTrending?: boolean;
  offerLabel?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  placedAt: string;
  updatedAt: string;
  statusHistory: { status: OrderStatus; date: string }[];
}

export interface SiteSettings {
  adminUsernameHint?: string;
}
