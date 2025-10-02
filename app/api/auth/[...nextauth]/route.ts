import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { sendEmail } from "@/lib/email";

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      const to = process.env.SMTP_USER || "";
      try {
        await sendEmail({
          to,
          subject: "New sign-in on lawmwad",
          text: `User: ${user?.email || user?.name || "unknown"}\nProvider: ${account?.provider}`,
        });
      } catch (e) {
        // ignore
      }
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


