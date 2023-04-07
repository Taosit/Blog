import { EditorContent, Editor } from "@tiptap/react";
import editorStyles from "@/styles/editor.module.css";
import { MenuBar } from "../menuBar/MenuBar";
import styles from "./BlogEditor.module.css";

type BlogEditorProps = {
  editor: Editor | null;
};

const BlogEditor = ({ editor }: BlogEditorProps) => {
  return (
    <div className={styles.container}>
      <MenuBar editor={editor} />
      <EditorContent
        className={`${editorStyles.editor} ${styles.editor}`}
        editor={editor}
      />
    </div>
  );
};

export default BlogEditor;
