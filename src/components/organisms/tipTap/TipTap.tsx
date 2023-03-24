import { EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "../menuBar/MenuBar";
import styles from "./TipTap.module.css";

type TipTapProps = {
  editor: Editor | null;
};

const Tiptap = ({ editor }: TipTapProps) => {
  return (
    <div className={styles.container}>
      <MenuBar editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default Tiptap;
