"use client";
import "@/styles/global.css";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactNode } from "react";
import { Navbar } from "@/components/organisms/navbar/Navbar";

type Props = {};

export default function RootLayout({ children }: PropsWithChildren<Props>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
