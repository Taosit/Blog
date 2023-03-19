"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect } from "react";

export default function ProtectedRoute({ children }: PropsWithChildren<{}>) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "loading") return;
    if (session.status === "unauthenticated") {
      router.push("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (session.status === "authenticated") return <>{children}</>;
  return <div>Loading...</div>;
}
