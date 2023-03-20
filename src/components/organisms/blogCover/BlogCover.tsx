"use client";

import ColorPicker from "@/components/atoms/colorPicker/ColorPicker";
import { Radio } from "@/components/atoms/radio/Radio";
import { cropImageRectangle, toColorString } from "@/lib/helpers";
import { draftPostType, savedPostType } from "@/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BlogCover.module.css";

type BlogCoverProps = {
  blog: draftPostType;
  setBlog: React.Dispatch<React.SetStateAction<draftPostType>>;
};

export default function BlogCover({ blog, setBlog }: BlogCoverProps) {
  const uploadRef = useRef<HTMLLabelElement>(null);

  const backgroundColor = {
    backgroundColor: blog.color
      ? toColorString(blog.color)
      : toColorString({ h: 170, s: 80, l: 80 }),
  };
  const backgroundImage = {
    backgroundImage: blog.image ? `url(${blog.image})` : "none",
  };

  const upLoadImage = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.[0]) return;
      const imageFile = e.target.files[0];
      if (imageFile.type.split("/")[0] !== "image") return;
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const image = reader.result as string;
        if (!image) return;
        const croppedImage = await cropImageRectangle(image);
        setBlog((prev) => ({ ...prev, image: croppedImage }));
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    console.log({ blog });
  }, [blog]);

  return (
    <div className={styles.container}>
      <label>Cover</label>
      <div
        className={styles.box}
        style={blog.coverType === "COLOR" ? backgroundColor : backgroundImage}
      >
        <Radio
          className={styles.radio}
          items={["Color", "Image"]}
          hasDefault={blog.coverType === "COLOR" ? 0 : 1}
          onSelectItem={(item) => {
            setBlog((prev) => ({
              ...prev,
              coverType: item.toUpperCase() as "COLOR" | "IMAGE",
            }));
          }}
        />
        {blog.coverType === "COLOR" && (
          <div className={styles.colorPickerContainer}>
            <label>Palette</label>
            <ColorPicker
              color={blog.color || { h: 170, s: 80, l: 80 }}
              onChange={(currentColor) =>
                setBlog((prev) => ({ ...prev, color: currentColor }))
              }
            />
          </div>
        )}
        {blog.coverType === "IMAGE" && (
          <>
            <label
              className={styles.upload}
              tabIndex={0}
              ref={uploadRef}
              htmlFor="cover-image"
              onKeyDown={(e) => e.key === "Enter" && uploadRef.current?.click()}
            >
              Upload
            </label>
            <input
              className={styles.imageInput}
              id="cover-image"
              onChange={upLoadImage}
              type="file"
            />
          </>
        )}
      </div>
    </div>
  );
}
