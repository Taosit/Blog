"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "./Nav.module.css";
import { userFields } from "@/types/types";
import { fetchUser } from "@/lib/api";
import UserAvatar from "@/components/atoms/userAvatar/UserAvatar";

export const Nav = () => {
  const session = useSession();
  const [user, setUser] = useState<Partial<userFields>>({});
  useEffect(() => {
    if (!session.data?.user) return;
    const user = session.data.user as userFields;
    fetchUser(user.id).then((data) => {
      setUser(data);
    });
  }, [session.data?.user]);

  return (
    <div className={styles.nav}>
      {user?.id ? (
        <Link href={`user/${user.id}`} className={styles.container}>
          <UserAvatar user={user} size="small" />
          <p>{user.name?.split(" ")[0] || "User"}</p>
        </Link>
      ) : (
        <button className={styles.container} onClick={() => signIn()}>
          <UserAvatar size="small" />
          <p>Sign in</p>
        </button>
      )}
    </div>
  );
};
