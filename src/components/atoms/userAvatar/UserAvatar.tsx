import React from "react";
import Image from "next/image";
import styles from "./UserAvatar.module.css";
import { DefaultAvatar } from "../defaultAvatar/DefaultAvatar";
import { darkenColor } from "@/lib/helpers";
import { HslColorType } from "@/types/main";
import { Prisma } from "@prisma/client";

type UserAvatarProps = {
  user?: {
    color?: Prisma.JsonValue;
    image?: string | null;
  };
  size?: "small" | "medium" | "large";
};

export default function UserAvatar({ user, size }: UserAvatarProps) {
  const avatarDiameter = 72;
  if (user?.image) {
    return (
      <Image
        className={styles[size || "medium"]}
        src={user.image}
        height={avatarDiameter}
        width={avatarDiameter}
        alt="avatar"
      />
    );
  }
  return (
    <DefaultAvatar
      className={styles[size || "medium"]}
      color={user?.color ? darkenColor(user.color as HslColorType) : undefined}
      height={avatarDiameter}
      width={avatarDiameter}
    />
  );
}
