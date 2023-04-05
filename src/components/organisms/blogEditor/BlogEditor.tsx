import { EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "../menuBar/MenuBar";
import styles from "./BlogEditor.module.css";

type BlogEditorProps = {
  editor: Editor | null;
};

const BlogEditor = ({ editor }: BlogEditorProps) => {
  return (
    <div className={styles.container}>
      <MenuBar editor={editor} />
      <EditorContent className={styles.editor} editor={editor} />
    </div>
  );
};

export default BlogEditor;
