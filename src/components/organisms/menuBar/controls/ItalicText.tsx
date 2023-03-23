import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./Controls.module.css";

type ItalicTextProps = {
  editor: Editor | null;
};

export function ItalicText({ editor }: ItalicTextProps) {
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      className={`${styles.button} ${
        editor.isActive("italic") ? styles.isActive : ""
      }`}
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M224 857v-80h134l139-409H338v-80h380v80H584L445 777h159v80H224Z"
        />
      </svg>
    </button>
  );
}
