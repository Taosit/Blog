import { EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "../menuBar/MenuBar";
import styles from "./CommentEditor.module.css";

type CommentEditorProps = {
  editor: Editor | null;
};

const CommentEditor = ({ editor }: CommentEditorProps) => {
  return (
    <div className={styles.container}>
      <MenuBar editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default CommentEditor;
