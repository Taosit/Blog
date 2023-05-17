import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/prismadb";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session(params: Params) {
      if (params.session && params.user) {
        return { ...params.session, user: params.user };
      }
      return params.session;
    },
  },
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?verifyEmail=true",
    newUser: "/account",
  },
};
export default NextAuth(authOptions);
