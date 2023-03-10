import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import React from "react";
import Image from "next/image";
import styles from "./User.module.css";
import Link from "next/link";

type UserProps = {
  name: string;
  color: string | undefined;
  avatar: string;
  href?: string;
};

export const User = ({ name, color, avatar, href }: UserProps) => {
  return href ? (
    <Link href={href} className={styles.container}>
      {avatar === "" ? (
        <DefaultAvatar color={color} height={60} width={60} />
      ) : (
        <Image src={avatar} height={60} width={60} alt="avatar" />
      )}
      <h4>{name}</h4>
    </Link>
  ) : (
    <div className={styles.container}>
      {avatar === "" ? (
        <DefaultAvatar color={color} height={60} width={60} />
      ) : (
        <Image src={avatar} height={60} width={60} alt="avatar" />
      )}
      <h4>{name}</h4>
    </div>
  );
};
