"use client";

import { Editor } from "@tiptap/react";
import React, { useCallback } from "react";
import styles from "./Controls.module.css";

type YoutubeProps = {
  editor: Editor | null;
};

export function Youtube({ editor }: YoutubeProps) {
  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  }, [editor]);

  if (!editor) return null;
  return (
    <button type="button" onClick={addYoutubeVideo} className={styles.button}>
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 96 960 960"
      >
        <path
          className={styles.icon}
          d="m387 745 261-169-261-169v338ZM180 936q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600V276H180v600Zm0-600v600-600Z"
        />
      </svg>
    </button>
  );
}
