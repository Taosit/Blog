import { Post, User } from "@prisma/client";
import { generateHTML } from "@tiptap/html";
import styles from "./BlogContent.module.css";
import editorStyles from "@/styles/editor.module.css";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { editorExtensions } from "@/lib/editorConfig";

type PostContentProps = {
  postPromise: Promise<any>;
};

export default async function BlogContent({ postPromise }: PostContentProps) {
  const post = await postPromise;
  const content = generateHTML(post.content, editorExtensions);

  return (
    <div className={styles.container}>
      <div className={`${editorStyles.editor} ${styles.editor}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
