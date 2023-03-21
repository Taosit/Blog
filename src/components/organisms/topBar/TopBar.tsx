"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TopBar.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Link from "next/link";
import doubleLeft from "./double-left.svg";
import { Class, Post, User } from "@prisma/client";
import { HslColorType, userFields } from "@/types/types";
import { cropImageSquare, toColorString } from "@/lib/helpers";
import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { updateUserColor, updateUserImage } from "@/lib/api";
import { useRouter } from "next/navigation";

type UserType = User & {
  classes: Class[];
  posts: Post[];
};

type TopBarProps = {
  userPromise: Promise<
    User & {
      classes: Class[];
      posts: Post[];
    }
  >;
};

export default function TopBar({ userPromise }: TopBarProps) {
  const [user, setUser] = useState<Partial<UserType>>({});
  const [color, setColor] = useState<HslColorType>({ h: 0, s: 0, l: 80 });
  const backgroundImage = `linear-gradient(180deg, ${toColorString(
    color
  )} 66.67%, white 66.67%)`;

  const router = useRouter();
  const uploadRef = useRef<HTMLLabelElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userPromise.then((user) => {
      setUser(user);
      setColor(user.color as HslColorType);
    });
  }, [userPromise]);

  const updateColor = useCallback(async () => {
    await updateUserColor({
      userId: user.id!,
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
          userId: user.id!,
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
            {user.image ? (
              <Image src={user.image} alt="avatar" fill />
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
          <h1 className={styles.username}>{user.name?.split(" ")[0]}</h1>
        </div>
      </div>
    </div>
  );
}
