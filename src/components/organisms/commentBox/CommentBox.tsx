"use client";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import CommentEditor from "../commentEditor/CommentEditor";
import styles from "./CommentBox.module.css";
import { Button } from "@/components/atoms/button/Button";
import { useSession } from "next-auth/react";
import { userFields } from "@/types/types";
import { sendComment } from "@/lib/api";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function CommentBox() {
  const { status, data: session } = useSession();

  const pathname = usePathname();
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link,
      Image,
      Youtube,
    ],
    content: "<p>Leave a comment ...</p>",
  });

  const send = () => {
    if (!session?.user) return;
    const content = editor?.getJSON();
    if (!content) return;
    const user = session.user as userFields;
    const postId = pathname?.match(/^\/blogs\/([a-zA-Z0-9]+)$/)?.[1];
    if (!postId) return;
    sendComment(postId, content).then((res) => {
      console.log(res);
      router.refresh();
    });
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
