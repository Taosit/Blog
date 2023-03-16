"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import styles from "./TopBar.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Link from "next/link";
import doubleLeft from "./double-left.svg";
import { Class, Color, Post, User } from "@prisma/client";
import { HslColorType } from "@/types/types";
import { toColorString } from "@/lib/helpers";
import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { updateUser, updateUserColor } from "@/lib/api";

type TopBarProps = {
  user: User & {
    color: Color | null;
    classes: Class[];
    posts: Post[];
  };
};

export default function TopBar({ user }: TopBarProps) {
  const { name, color: initialColor, image } = user;
  const [color, setColor] = useState<HslColorType>({
    h: initialColor?.h || 0,
    s: initialColor?.s || 50,
    l: 80,
  });
  const backgroundImage = `linear-gradient(180deg, ${toColorString(
    color
  )} 66.67%, white 66.67%)`;

  const updateColor = useCallback(async () => {
    await updateUserColor({
      userId: user.id,
      color,
    });
  }, [color, user.id]);

  return (
    <div className={styles.topBar} style={{ backgroundImage }}>
      <div className={styles.container}>
        <Link href="/">
          <Image src={doubleLeft} alt="" />
          <p>All Blogs</p>
        </Link>
        <div className={styles.themeContainer}>
          <label htmlFor="theme-color-picker">Theme</label>
          <ColorPicker
            color={color}
            onChange={setColor}
            onSetColor={updateColor}
          />
        </div>
        <div className={styles.userContainer}>
          {image ? (
            <Image
              src={image}
              className={styles.avatar}
              height={100}
              width={100}
              alt="avatar"
            />
          ) : (
            <DefaultAvatar color="" className={styles.avatar} />
          )}
          <h1 className={styles.username}>{name?.split(" ")[0]}</h1>
        </div>
      </div>
    </div>
  );
}
