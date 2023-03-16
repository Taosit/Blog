"use client";

import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "./Nav.module.css";
import { userFields } from "@/types/types";

export const Nav = () => {
  const session = useSession();
  const user = session.data?.user as userFields;

  return (
    <div className={styles.nav}>
      {user ? (
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
