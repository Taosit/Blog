"use client";

import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "../user/User";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const session = useSession();
  console.log({ session });

  return (
    <div className={styles.nav}>
      {session.data ? (
        <User name="User" color="" avatar="" href="/profile" />
      ) : (
        <button className={styles.container} onClick={() => signIn()}>
          <DefaultAvatar />
          <p>Sign in</p>
        </button>
      )}
      <div className={styles.links}>
        <Link href="/profile">Profile</Link>
        <Link href="/blogs">Blogs</Link>
      </div>
    </div>
  );
};
