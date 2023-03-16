"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TopBar.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Link from "next/link";
import doubleLeft from "./double-left.svg";
import { Class, Color, Post, User } from "@prisma/client";
import { HslColorType } from "@/types/types";
import { toColorString } from "@/lib/helpers";
import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { updateUser, updateUserColor, updateUserImage } from "@/lib/api";
import { useRouter } from "next/navigation";

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
    s: initialColor?.s || 100,
    l: 80,
  });
  const backgroundImage = `linear-gradient(180deg, ${toColorString(
    color
  )} 66.67%, white 66.67%)`;

  const router = useRouter();
  const uploadRef = useRef<HTMLLabelElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const updateColor = useCallback(async () => {
    await updateUserColor({
      userId: user.id,
      color,
    });
  }, [color, user.id]);

  const updateImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        if (!reader.result) return;
        updateUserImage({
          image: reader.result as string,
          userId: user.id,
        }).then(() => router.refresh());
        overlayRef.current?.blur();
      };
    },
    [user.id]
  );

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
          <div className={styles.imageContainer}>
            {image ? (
              <Image src={image} alt="avatar" fill />
            ) : (
              <DefaultAvatar
                color={toColorString({ ...color, s: 30, l: 40 })}
                className={styles.defaultAvatar}
              />
            )}
            <div
              className={styles.overlay}
              ref={overlayRef}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && uploadRef.current?.click()}
            >
              <label
                htmlFor="avatar-upload"
                ref={uploadRef}
                className={styles.uploadButton}
              >
                Change
              </label>
              <input id="avatar-upload" type="file" onChange={updateImage} />
            </div>
          </div>
          <h1 className={styles.username}>{name?.split(" ")[0]}</h1>
        </div>
      </div>
    </div>
  );
}
