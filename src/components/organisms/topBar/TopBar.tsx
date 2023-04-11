"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./TopBar.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Link from "next/link";
import doubleLeft from "./double-left.svg";
import { HslColorType } from "@/types/types";
import { cropImageSquare, toColorString } from "@/lib/helpers";
import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { useRouter } from "next/navigation";
import { trpc } from "@/providers/TrpcProvider";

type TopBarProps = {
  userId: string;
};

export default function TopBar({ userId }: TopBarProps) {
  const [color, setColor] = useState<HslColorType>({ h: 0, s: 0, l: 80 });

  const router = useRouter();
  const uploadRef = useRef<HTMLLabelElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { data: user } = trpc.user.getUser.useQuery({
    userId,
  });
  const colorMutation = trpc.user.updateUserColor.useMutation();
  const avatarMutation = trpc.user.updateUserAvatar.useMutation();

  useEffect(() => {
    if (!user) return;
    setColor(user.color as HslColorType);
  }, [user]);

  const updateColor = colorMutation.mutate;

  const updateImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const imageFile = e.target.files[0];
    if (imageFile.type.split("/")[0] !== "image") return;
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onloadend = async () => {
      const image = reader.result as string;
      if (!image) return;
      const croppedImage = await cropImageSquare(image);
      avatarMutation.mutate(
        {
          image: croppedImage,
          userId,
        },
        {
          onSuccess: () => {
            console.log("success");
            router.refresh();
            overlayRef.current?.blur();
          },
        }
      );
    };
  };

  const backgroundImage = `linear-gradient(180deg, ${toColorString(
    color
  )} 66.67%, white 66.67%)`;

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
            onSetColor={() => updateColor({ userId: user!.id, color })}
          />
        </div>
        <div className={styles.userContainer}>
          <div className={styles.imageContainer}>
            {user?.image ? (
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
          <h1 className={styles.username}>{user?.firstName || "User"}</h1>
        </div>
      </div>
    </div>
  );
}
