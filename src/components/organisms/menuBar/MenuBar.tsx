"use client";

import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { Editor } from "@tiptap/react";
import { useCallback, useMemo } from "react";
import { BulletList } from "./controls/BulletList";
import { NumberedList } from "./controls/NumberedList";
import { BoldText } from "./controls/BoldText";
import { ItalicText } from "./controls/ItalicText";
import { StrikeText } from "./controls/StrikeText";
import { Undo } from "./controls/Undo";
import { Redo } from "./controls/Redo";
import { Hyperlink } from "./controls/Hyperlink";
import { ImageBlock } from "./controls/ImageBlock";
import { Youtube } from "./controls/Youtube";
import styles from "./MenuBar.module.css";

type MenuBarProps = {
  editor: Editor | null;
};
export const MenuBar = ({ editor }: MenuBarProps) => {
  const textLevels = ["Paragraph", "Heading 1", "Heading 2", "Heading 3"];
  const setHeading = useCallback(
    (level: string) => {
      if (!editor) {
        return;
      }
      switch (level) {
        case "Heading 1":
          editor.chain().focus().setHeading({ level: 1 }).run();
          break;
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

  const isH1Active = editor?.isActive("heading", { level: 1 });
  const isH2Active = editor?.isActive("heading", { level: 2 });
  const isH3Active = editor?.isActive("heading", { level: 3 });
  const isParagraphActive = editor?.isActive("paragraph");

  const getCurrentTextLevel = useMemo(() => {
    if (isH1Active) return "Heading 1";
    if (isH2Active) return "Heading 2";
    if (isH3Active) return "Heading 3";
    if (isParagraphActive) return "Paragraph";
  }, [isH1Active, isH2Active, isH3Active, isParagraphActive]);

  const addYoutubeVideo = useCallback(() => {
    if (!editor) return;
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <Undo editor={editor} />
      <Redo editor={editor} />
      <BoldText editor={editor} />
      <ItalicText editor={editor} />
      <StrikeText editor={editor} />
      <Dropdown
        className={styles.levelDropdown}
        items={textLevels}
        onSelectItem={setHeading}
        activeItem={getCurrentTextLevel}
      />
      <BulletList editor={editor} />
      <NumberedList editor={editor} />
      <Hyperlink editor={editor} />
      <ImageBlock editor={editor} />
      <Youtube editor={editor} />
    </div>
  );
};
