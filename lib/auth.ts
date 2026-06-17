import { timingSafeEqual } from "crypto";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) return null;
        if (!credentials?.email || !credentials?.password) return null;

        const emailMatches = safeEqual(credentials.email, adminEmail);
        const passwordMatches = safeEqual(credentials.password, adminPassword);

        if (!emailMatches || !passwordMatches) return null;

        return { id: "admin", email: adminEmail, name: "Admin" };
      },
    }),
  ],
};
