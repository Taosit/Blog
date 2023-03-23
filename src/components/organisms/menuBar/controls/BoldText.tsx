import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./Controls.module.css";

type BoldTextProps = {
  editor: Editor | null;
};

export function BoldText({ editor }: BoldTextProps) {
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      className={`${styles.button} ${
        editor.isActive("bold") ? styles.isActive : ""
      }`}
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M275 856V296h228q66 0 114.5 42T666 444q0 38-21 70t-56 49v6q43 14 69.5 50t26.5 81q0 68-52.5 112T510 856H275Zm86-76h144q38 0 66-25t28-63q0-37-28-62t-66-25H361v175Zm0-247h136q35 0 60.5-23t25.5-58q0-35-25.5-58.5T497 370H361v163Z"
        />
      </svg>
    </button>
  );
}
