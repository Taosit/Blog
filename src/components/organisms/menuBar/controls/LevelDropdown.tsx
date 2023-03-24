"use client";

import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { Editor } from "@tiptap/react";
import React, { useCallback, useMemo } from "react";
import styles from "./Controls.module.css";

type LevelDropdownProps = {
  editor: Editor | null;
};

export function LevelDropdown({ editor }: LevelDropdownProps) {
  const textLevels = ["Paragraph", "Heading 2", "Heading 3"];

  const setHeading = useCallback(
    (level: string) => {
      if (!editor) {
        return;
      }
      switch (level) {
        case "Heading 2":
          editor.chain().focus().setHeading({ level: 2 }).run();
          break;
        case "Heading 3":
          editor.chain().focus().setHeading({ level: 3 }).run();
          break;
        case "Paragraph":
          editor.chain().focus().setParagraph().run();
          break;
        default:
          break;
      }
    },
    [editor]
  );

  const isH2Active = editor?.isActive("heading", { level: 2 });
  const isH3Active = editor?.isActive("heading", { level: 3 });
  const isParagraphActive = editor?.isActive("paragraph");

  const getCurrentTextLevel = useMemo(() => {
    if (isH2Active) return "Heading 2";
    if (isH3Active) return "Heading 3";
    if (isParagraphActive) return "Paragraph";
  }, [isH2Active, isH3Active, isParagraphActive]);

  if (!editor) return null;

  return (
    <Dropdown
      className={styles.levelDropdown}
      items={textLevels}
      hasBorder={false}
      onSelectItem={setHeading}
      activeItem={getCurrentTextLevel}
    />
  );
}
