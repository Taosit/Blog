import client from "@/lib/prismadb";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import styles from "./Comments.module.css";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

type CommentsProps = {
  postId: string;
};

const getComments = async (postId: string) => {
  const comments = client.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: true,
    },
  });
  return comments;
};

export default async function Comments({ postId }: CommentsProps) {
  const comments = await getComments(postId);
  const commentsWithHTML = comments.map((comment) => {
    const content = generateHTML(comment.content as any, [
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
    return {
      ...comment,
      content,
    };
  });

  return (
    <div>
      <h2>Comments</h2>
      {commentsWithHTML.map((comment) => {
        return (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.author}>{comment.author.name}</div>
            <div className={styles.editor}>
              <div dangerouslySetInnerHTML={{ __html: comment.content }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
