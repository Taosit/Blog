"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

export default function ProtectedRoutes({ children }: PropsWithChildren<{}>) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const accountPageMatcher = /^\/account/;
  const profilePageMatcher = /^\/user\/\w+/;
  const createPageMatcher = /^\/blogs\/new/;
  const editPageMatcher = /^\/blogs\/\w+\/edit/;
  const matcher = [
    accountPageMatcher,
    profilePageMatcher,
    createPageMatcher,
    editPageMatcher,
  ];

  useEffect(() => {
    if (session.status === "authenticated") return;
    if (pathname && matcher.some((m) => m.test(pathname))) {
      router.push("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, pathname]);

  return <>{children}</>;
}
