import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./Controls.module.css";

type UndoProps = {
  editor: Editor | null;
};

export function Undo({ editor }: UndoProps) {
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().chain().focus().undo().run()}
      className={styles.button}
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M280 856v-60h289q70 0 120.5-46.5T740 634q0-69-50.5-115.5T569 472H274l114 114-42 42-186-186 186-186 42 42-114 114h294q95 0 163.5 64T800 634q0 94-68.5 158T568 856H280Z"
        />
      </svg>
    </button>
  );
}
