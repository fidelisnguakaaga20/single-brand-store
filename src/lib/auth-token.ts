// lib/auth-token.ts
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

export type UserRole = "CUSTOMER" | "ADMIN";

/**
 * Extend JWTPayload so TypeScript is happy to pass this into SignJWT.
 * This does NOT change runtime behaviour, it only satisfies the type system.
 */
export interface AuthTokenPayload extends JWTPayload {
  userId: string;
  role: UserRole;
}

export async function createAuthToken(
  payload: AuthTokenPayload
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(
  token: string
): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}


// // lib/auth-token.ts
// import { SignJWT, jwtVerify } from "jose";

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.AUTH_SECRET || "dev-secret-change-me"
// );

// export type UserRole = "CUSTOMER" | "ADMIN";

// export interface AuthTokenPayload {
//   userId: string;
//   role: UserRole;
// }

// export async function createAuthToken(payload: AuthTokenPayload): Promise<string> {
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(JWT_SECRET);
// }

// export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
//   try {
//     const { payload } = await jwtVerify(token, JWT_SECRET);
//     return payload as AuthTokenPayload;
//   } catch {
//     return null;
//   }
// }
