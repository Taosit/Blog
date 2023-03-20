"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TopBar.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Link from "next/link";
import doubleLeft from "./double-left.svg";
import { Class, Post, User } from "@prisma/client";
import { HslColorType } from "@/types/types";
import { cropImageSquare, toColorString } from "@/lib/helpers";
import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { updateUserColor, updateUserImage } from "@/lib/api";
import { useRouter } from "next/navigation";

type TopBarProps = {
  user: User & {
    classes: Class[];
    posts: Post[];
  };
};

export default function TopBar({ user }: TopBarProps) {
  const { name, color: initialColor, image } = user;
  const hslColor = initialColor as HslColorType;
  const [color, setColor] = useState<HslColorType>(hslColor);
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
      if (imageFile.type.split("/")[0] !== "image") return;
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const image = reader.result as string;
        if (!image) return;
        const croppedImage = await cropImageSquare(image);
        updateUserImage({
          image: croppedImage,
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
              <DefaultAvatar color={color} className={styles.defaultAvatar} />
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
