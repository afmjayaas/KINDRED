// Uses the standard Web Crypto API (globalThis.crypto.subtle) instead of Node's
// "crypto" module so this works identically in the Node.js runtime (API routes,
// server components) and the Edge runtime (middleware).

const SECRET = process.env.SESSION_SECRET || "kindred-dev-secret";
export const SESSION_COOKIE = "kindred_admin_session";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  username: string;
  exp: number;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  const binary = typeof atob === "function" ? atob(padded) : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    textToBytes(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(data: string): Promise<string> {
  const key = await getKey();
  const signature = await crypto.subtle.sign("HMAC", key, textToBytes(data));
  return toBase64Url(new Uint8Array(signature));
}

async function verify(data: string, signature: string): Promise<boolean> {
  try {
    const key = await getKey();
    return await crypto.subtle.verify("HMAC", key, fromBase64Url(signature), textToBytes(data));
  } catch {
    return false;
  }
}

export function verifyCredentials(username: string, password: string): boolean {
  const envUser = process.env.ADMIN_USERNAME || "admin";
  const envPass = process.env.ADMIN_PASSWORD || "Kindred@2026";
  return username === envUser && password === envPass;
}

export async function signSession(payload: { username: string }): Promise<string> {
  const body: SessionPayload = { username: payload.username, exp: Date.now() + MAX_AGE_MS };
  const encoded = toBase64Url(textToBytes(JSON.stringify(body)));
  const signature = await sign(encoded);
  return `${encoded}.${signature}`;
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const valid = await verify(encoded, signature);
  if (!valid) return null;
  try {
    const json = new TextDecoder().decode(fromBase64Url(encoded));
    const payload = JSON.parse(json) as SessionPayload;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
