import fs from "fs";
import path from "path";
import { Product, JournalPost, Banner, Order } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureFile(file: string, defaultContent: unknown) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(defaultContent, null, 2));
  }
  return fp;
}

function readJson<T>(file: string, fallback: T): T {
  try {
    const fp = ensureFile(file, fallback);
    const raw = fs.readFileSync(fp, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return fallback;
  }
}

function writeJson<T>(file: string, data: T): void {
  const fp = ensureFile(file, data);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

// ---------- Products ----------
export function getProducts(): Product[] {
  return readJson<Product[]>("products.json", []);
}
export function saveProducts(products: Product[]): void {
  writeJson("products.json", products);
}
export function getProductBySlug(slug: string): Product | undefined {
  return getProducts().find((p) => p.slug === slug);
}
export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id);
}

// ---------- Journal ----------
export function getJournalPosts(): JournalPost[] {
  return readJson<JournalPost[]>("journal.json", []);
}
export function saveJournalPosts(posts: JournalPost[]): void {
  writeJson("journal.json", posts);
}
export function getJournalPostBySlug(slug: string): JournalPost | undefined {
  return getJournalPosts().find((p) => p.slug === slug);
}

// ---------- Banners ----------
export function getBanners(): Banner[] {
  return readJson<Banner[]>("banners.json", []);
}
export function saveBanners(banners: Banner[]): void {
  writeJson("banners.json", banners);
}

// ---------- Orders ----------
export function getOrders(): Order[] {
  return readJson<Order[]>("orders.json", []);
}
export function saveOrders(orders: Order[]): void {
  writeJson("orders.json", orders);
}
export function getOrderByNumberAndContact(
  orderNumber: string,
  contact: string
): Order | undefined {
  const norm = (s: string) => s.trim().toLowerCase();
  return getOrders().find(
    (o) =>
      norm(o.orderNumber) === norm(orderNumber) &&
      (norm(o.phone) === norm(contact) || norm(o.email) === norm(contact))
  );
}
