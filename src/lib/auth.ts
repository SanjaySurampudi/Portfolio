import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-key-replace-in-production-env";

export interface SessionUser {
  id: string;
  username: string;
}

// Hash password with pbkdf2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// Verify password
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(":");
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
    return hash === testHash;
  } catch (error) {
    return false;
  }
}

// Generate JWT token
export function generateToken(payload: SessionUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Get session user from cookie
export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as SessionUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Log out admin
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
