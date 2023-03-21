"use client";

import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Nav.module.css";
import { userFields } from "@/types/types";
import { fetchUser } from "@/lib/api";

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
          {user?.image ? (
            <Image
              src={user.image}
              className={styles.avatar}
              height={40}
              width={40}
              alt="avatar"
            />
          ) : (
            <DefaultAvatar color={user?.color} className={styles.avatar} />
          )}
          <p>{user.name?.split(" ")[0] || "User"}</p>
        </Link>
      ) : (
        <button className={styles.container} onClick={() => signIn()}>
          <DefaultAvatar className={styles.avatar} />
          <p>Sign in</p>
        </button>
      )}
    </div>
  );
};
