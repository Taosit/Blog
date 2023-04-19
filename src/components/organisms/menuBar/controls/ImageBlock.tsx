"use client";

import { cropImage } from "@/lib/helpers";
import { trpc } from "@/providers/TrpcProvider";
import { Editor } from "@tiptap/react";
import React, { useCallback } from "react";
import styles from "./Controls.module.css";

type ImageBlockProps = {
  editor: Editor | null;
};

export function ImageBlock({ editor }: ImageBlockProps) {
  const imageMutation = trpc.image.uploadImage.useMutation();

  const addImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;
      if (!e.target.files?.[0]) return;
      const imageFile = e.target.files[0];
      if (imageFile.type.split("/")[0] !== "image") return;
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const image = reader.result as string;
        if (!image) return;
        const croppedImage = await cropImage(image);
        const url = await imageMutation.mutateAsync(croppedImage);
        editor.chain().focus().setImage({ src: url }).run();
      };
    },
    [editor]
  );

  if (!editor) return null;
  return (
    <label className={styles.button}>
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600V276H180v600Zm56-97h489L578 583 446 754l-93-127-117 152Zm-56 97V276v600Z"
        />
      </svg>
      <input
        onChange={(e) => addImage(e)}
        type="file"
        className={styles.input}
      />
    </label>
  );
}
