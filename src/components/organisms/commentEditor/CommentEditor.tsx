import { EditorContent, Editor } from "@tiptap/react";
import { MenuBar } from "../menuBar/MenuBar";
import styles from "./CommentEditor.module.css";
import editorStyles from "@/styles/editor.module.css";

type CommentEditorProps = {
  editor: Editor | null;
} & React.HTMLAttributes<HTMLDivElement>;

const CommentEditor = ({ editor, ...props }: CommentEditorProps) => {
  return (
    <div className={styles.container} {...props}>
      <MenuBar editor={editor} />
      <EditorContent
        className={`${editorStyles.editor} ${styles.editor}`}
        editor={editor}
      />
    </div>
  );
};

export default CommentEditor;
