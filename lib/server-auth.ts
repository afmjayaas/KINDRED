import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession } from "./auth";

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return !!(await verifySession(token));
}
