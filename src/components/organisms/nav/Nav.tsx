"use client";

import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import { user } from "@/seeds/user";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import styles from "./Nav.module.css";

export const Nav = () => {
  const session = useSession();
  console.log({ session });

  return (
    <div className={styles.nav}>
      {session.data ? (
        <Link href="/profile" className={styles.container}>
          {user.avatar === "" ? (
            <DefaultAvatar color={user.color} className={styles.avatar} />
          ) : (
            <Image
              src={user.avatar}
              className={styles.avatar}
              height={60}
              width={60}
              alt="avatar"
            />
          )}
          <p>{user.name.split(" ")[0]}</p>
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
