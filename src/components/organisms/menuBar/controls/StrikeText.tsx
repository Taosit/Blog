import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./Controls.module.css";

type StrikeTextProps = {
  editor: Editor | null;
};

export function StrikeText({ editor }: StrikeTextProps) {
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      className={`${styles.button} ${
        editor.isActive("strike") ? styles.isActive : ""
      }`}
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M504 896q-78 0-142-41.5T269 743l69-29q20 48 65 77t101 29q52 0 83-27t31-73q0-23-9.5-48.5T582 626h84q14 23 21 46t7 48q0 78-53 127t-137 49ZM80 566v-60h800v60H80Zm394-316q66 0 117 31t75 86l-69 31q-14-34-46.5-53T474 326q-49 0-79 24t-30 66q0 8 1 15t3 15h-74q-2-8-3-16t-1-16q0-73 51-118.5T474 250Z"
        />
      </svg>
    </button>
  );
}
