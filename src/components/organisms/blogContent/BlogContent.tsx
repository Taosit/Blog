import { generateHTML } from "@tiptap/html";
import styles from "./BlogContent.module.css";
import editorStyles from "@/styles/editor.module.css";
import { editorExtensions } from "@/lib/editorConfig";
import { formatDate, toColorString } from "@/lib/helpers";
import { HslColorType } from "@/types/main";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import Link from "next/link";
import UserAvatar from "@/components/atoms/userAvatar/UserAvatar";
import BackLink from "./backLink/BackLink";
import DeleteButton from "./deleteButton/DeleteButton";
import { Post, User } from "@prisma/client";
import { JSONContent } from "@tiptap/react";

type PostContentProps = {
  postPromise: Promise<Post & { author: User }>;
};

export default async function BlogContent({ postPromise }: PostContentProps) {
  const post = await postPromise;
  const content = generateHTML(post.content as JSONContent, editorExtensions);

  const session = await getServerSession(authOptions);
  const isAuthor = session && session.user && session.user.id === post.authorId;

  const style = {
    ...(post.coverType &&
      post.coverType === "IMAGE" && {
        backgroundImage: `url(${post.image})`,
      }),
    ...(post.coverType &&
      post.coverType === "COLOR" && {
        backgroundColor: toColorString(post.color as HslColorType),
      }),
  };

  return (
    <div className={styles.container}>
      <div className={`${editorStyles.editor} ${styles.editor}`}>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}
