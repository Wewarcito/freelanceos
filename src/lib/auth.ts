import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { authUsers, authAccounts, authSessions, authVerificationTokens } from "@/drizzle/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: authUsers,
    accountsTable: authAccounts,
    sessionsTable: authSessions,
    verificationTokensTable: authVerificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        const user = await db.query.authUsers.findFirst({
          where: (users, { eq }) => eq(users.email, credentials.email as string),
        });

        if (!user) {
          const newUser = {
            id: crypto.randomUUID(),
            email: credentials.email as string,
            emailVerified: null,
            name: null,
            image: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          await db.insert(authUsers).values(newUser);
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
