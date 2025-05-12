import { cookies } from "next/headers"

/**
 * Get the JWT token from cookies
 * This is a server-side function that can be used in Server Components
 */
export async function getJwt(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("jwt")?.value
    return token || null
  } catch (error) {
    console.error("Failed to get JWT from cookies:", error)
    return null
  }
}

/**
 * Get the JWT token from cookies in a client component
 * This is a client-side function that can be used in Client Components
 */
export function getJwtClient(): string | null {
  if (typeof window === "undefined") return null
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("jwt="))
    ?.split("=")[1] || null
} 