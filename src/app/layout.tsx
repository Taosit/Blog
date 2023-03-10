"use client";
import "@/styles/global.css";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, ReactNode } from "react";

type Props = {};

export default function RootLayout({ children }: PropsWithChildren<Props>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
