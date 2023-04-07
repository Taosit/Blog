"use client";

import { useEditor } from "@tiptap/react";
import CommentEditor from "../commentEditor/CommentEditor";
import styles from "./CommentBox.module.css";
import { Button } from "@/components/atoms/button/Button";
import { editorExtensions } from "@/lib/editorConfig";

type CommentBoxProps = {
  handleSend: (content: object) => void;
};

export default function CommentBox({ handleSend }: CommentBoxProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: "",
  });

  const send = () => {
    const content = editor?.getJSON();
    if (!content || !editor) return;
    handleSend(content);
    editor.commands.setContent("");
  };

  return (
    <div className={styles.container}>
      <CommentEditor editor={editor} />
      <Button size="large" className={styles.button} onClick={send}>
        Send
      </Button>
    </div>
  );
}
