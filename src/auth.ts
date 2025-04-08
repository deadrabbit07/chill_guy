// app/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            id: z.string().min(1),
            password: z.string().min(1),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { id, password } = parsedCredentials.data;

        try {
          if (id === "jbj338033" && password === "qwer1234") {
            return {
              id: "1",
              name: id,
              email: "jbj338033@gmail.com",
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
});
