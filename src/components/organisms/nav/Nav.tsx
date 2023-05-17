"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Nav.module.css";
import UserAvatar from "@/components/atoms/userAvatar/UserAvatar";
import { trpc } from "@/providers/TrpcProvider";
import { UserFields } from "@/types/main";

export const Nav = () => {
  const session = useSession();
  const userId = (session?.data?.user as UserFields)?.id;
  const { data: user, isLoading } = trpc.user.getUser.useQuery(
    {
      userId,
    },
    { enabled: !!session.data }
  );

  return (
    <div className={styles.nav}>
      {user?.id ? (
        <Link href={`user/${user.id}`} className={styles.container}>
          <UserAvatar user={user} size="small" />
          <p>{user.firstName || "User"}</p>
        </Link>
      ) : (
        <button className={styles.container} onClick={() => signIn()}>
          <UserAvatar size="small" />
          <p>{isLoading ? "User" : "Sign in"}</p>
        </button>
      )}
    </div>
  );
};
