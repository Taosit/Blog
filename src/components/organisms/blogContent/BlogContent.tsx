import { Post, User } from "@prisma/client";
import { generateHTML } from "@tiptap/html";
import React from "react";
import styles from "./BlogContent.module.css";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
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
