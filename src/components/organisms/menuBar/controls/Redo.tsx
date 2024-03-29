import { Editor } from "@tiptap/react";
import React from "react";
import styles from "./Controls.module.css";

type RedoProps = {
  editor: Editor | null;
};

export function Redo({ editor }: RedoProps) {
  if (!editor) return null;
  return (
    <button
      type="button"
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!editor.can().chain().focus().redo().run()}
      className={styles.button}
    >
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="M392 856q-95 0-163.5-64T160 634q0-94 68.5-158T392 412h294L572 298l42-42 186 186-186 186-42-42 114-114H391q-70 0-120.5 46.5T220 634q0 69 50.5 115.5T391 796h289v60H392Z"
        />
      </svg>
    </button>
  );
}
