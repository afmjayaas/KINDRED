import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { Product, JournalPost, Banner, Order, SiteSettings } from "./types";

// ---------------------------------------------------------------------------
// Storage layer.
//
// On Vercel, the deployment filesystem is read-only at runtime, so writing
// JSON files there does not persist. To make admin changes (products,
// orders, journal posts, banners, settings) actually stick on the live
// site, this uses Upstash Redis (REST-based, works great from serverless
// functions) when UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are
// configured (e.g. via the Vercel Marketplace "Upstash" integration).
//
// When those env vars are NOT set (typically local development), it falls
// back to the original JSON-file storage under /data so `npm run dev` keeps
// working out of the box with no extra setup.
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

function ensureFile(file: string, defaultContent: unknown) {
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(defaultContent, null, 2));
  }
  return fp;
}

function readJsonFile<T>(file: string, fallback: T): T {
  try {
    const fp = ensureFile(file, fallback);
    const raw = fs.readFileSync(fp, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read ${file}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(file: string, data: T): void {
  const fp = ensureFile(file, data);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

// One JSON-serializable value per Redis key, mirroring one file per
// collection in the file-storage fallback.
async function readCollection<T>(key: string, file: string, fallback: T): Promise<T> {
  if (redis) {
    try {
      const value = await redis.get<T>(key);
      return value === null || value === undefined ? fallback : value;
    } catch (err) {
      console.error(`[db] Redis read failed for ${key}:`, err);
      return fallback;
    }
  }
  return readJsonFile<T>(file, fallback);
}

async function writeCollection<T>(key: string, file: string, data: T): Promise<void> {
  if (redis) {
    await redis.set(key, data);
    return;
  }
  writeJsonFile(file, data);
}

// ---------- Products ----------
export async function getProducts(): Promise<Product[]> {
  return readCollection<Product[]>("kindred:products", "products.json", []);
}
export async function saveProducts(products: Product[]): Promise<void> {
  await writeCollection("kindred:products", "products.json", products);
}
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}
export async function getProductById(id: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.id === id);
}

// ---------- Journal ----------
export async function getJournalPosts(): Promise<JournalPost[]> {
  return readCollection<JournalPost[]>("kindred:journal", "journal.json", []);
}
export async function saveJournalPosts(posts: JournalPost[]): Promise<void> {
  await writeCollection("kindred:journal", "journal.json", posts);
}
export async function getJournalPostBySlug(slug: string): Promise<JournalPost | undefined> {
  return (await getJournalPosts()).find((p) => p.slug === slug);
}

// ---------- Banners ----------
export async function getBanners(): Promise<Banner[]> {
  return readCollection<Banner[]>("kindred:banners", "banners.json", []);
}
export async function saveBanners(banners: Banner[]): Promise<void> {
  await writeCollection("kindred:banners", "banners.json", banners);
}

// ---------- Orders ----------
export async function getOrders(): Promise<Order[]> {
  return readCollection<Order[]>("kindred:orders", "orders.json", []);
}
export async function saveOrders(orders: Order[]): Promise<void> {
  await writeCollection("kindred:orders", "orders.json", orders);
}
export async function getOrderByNumberAndContact(
  orderNumber: string,
  contact: string
): Promise<Order | undefined> {
  const norm = (s: string) => s.trim().toLowerCase();
  return (await getOrders()).find(
    (o) =>
      norm(o.orderNumber) === norm(orderNumber) &&
      (norm(o.phone) === norm(contact) || norm(o.email) === norm(contact))
  );
}

// ---------- Site Settings ----------
export async function getSettings(): Promise<SiteSettings> {
  return readCollection<SiteSettings>("kindred:settings", "settings.json", {});
}
export async function saveSettings(settings: SiteSettings): Promise<void> {
  await writeCollection("kindred:settings", "settings.json", settings);
}

// Lets API routes report which storage backend is active (used by the
// admin dashboard / settings page so the admin knows whether changes will
// actually persist on the live site).
export function isPersistentStorageConfigured(): boolean {
  return !!redis;
}
