"use client";
import ProtectedRoutes from "@/components/atoms/protectedRoutes/ProtectedRoutes";
import "@/styles/global.css";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ProtectedRoutes>{children}</ProtectedRoutes>
        </SessionProvider>
      </body>
    </html>
  );
}
