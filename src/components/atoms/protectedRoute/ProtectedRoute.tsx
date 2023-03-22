"use client";
import { userFields } from "@/types/types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect, useState } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren<{}>) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isPermitted, setIsPermitted] = useState(false);

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    const id = pathname?.match(/^\/user\/([a-zA-Z0-9]+)$/)?.[1];
    const user = session.data?.user as userFields;
    if (pathname && ((id && user.id !== id) || (pathname === "/account" && user.studentNumber))) {
      router.push(`/user/${user.id}`);
      return;
    }
    setIsPermitted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (isPermitted) return <>{children}</>;
  return <div>Loading...</div>;
}
