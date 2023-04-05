import { Post, User } from "@prisma/client";
import { generateHTML } from "@tiptap/html";
import styles from "./BlogContent.module.css";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

type PostType = Post & {
  author: User;
};

type PostContentProps = {
  postPromise: Promise<any>;
};

export default async function BlogContent({ postPromise }: PostContentProps) {
  const post = await postPromise;
  const content = generateHTML(post.content, [
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
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.editor}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
