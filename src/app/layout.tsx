"use client";
import { TrpcProvider } from "@/providers/TrpcProvider";
import "@/styles/global.css";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren<{}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <TrpcProvider>{children}</TrpcProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
