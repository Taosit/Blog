import { Editor } from "@tiptap/react";
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
import { LevelDropdown } from "./controls/LevelDropdown";
import styles from "./MenuBar.module.css";

type MenuBarProps = {
  editor: Editor | null;
};

export const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menuBar}>
      <div className={styles.buttonGroup}>
        <Undo editor={editor} />
        <Redo editor={editor} />
      </div>
      <div className={styles.buttonGroup}>
        <BoldText editor={editor} />
        <ItalicText editor={editor} />
        <StrikeText editor={editor} />
      </div>
      <LevelDropdown editor={editor} />
      <div className={styles.buttonGroup}>
        <BulletList editor={editor} />
        <NumberedList editor={editor} />
      </div>
      <div className={styles.buttonGroup}>
        <Hyperlink editor={editor} />
        <ImageBlock editor={editor} />
        <Youtube editor={editor} />
      </div>
    </div>
  );
};
