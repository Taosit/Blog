"use client";

import { Prisma, User } from "@prisma/client";
import { generateHTML } from "@tiptap/html";
import styles from "./Comments.module.css";
import { formatTimeAgo } from "@/lib/helpers";
import editIcon from "./edit.svg";
import deleteIcon from "./delete.svg";
import doneIcon from "./done.svg";
import { useEffect, useState } from "react";
import { editorExtensions } from "@/lib/editorConfig";
import CommentEditor from "../commentEditor/CommentEditor";
import { useEditor } from "@tiptap/react";
import UserAvatar from "@/components/atoms/userAvatar/UserAvatar";
import IconButton from "@/components/atoms/iconButton/IconButton";
import editorStyles from "@/styles/editor.module.css";
import { useSession } from "next-auth/react";
import { userFields } from "@/types/types";

type CommentType = {
  id: string;
  createdAt: string;
  content: Prisma.JsonValue;
  authorId: string;
  postId: string;
  author: User;
};

type CommentsProps = {
  comments: CommentType[];
  handleDelete: (id: string) => void;
  handleDoneEdit: (id: string, content: object) => void;
};

export default function Comments({
  comments,
  handleDelete,
  handleDoneEdit,
}: CommentsProps) {
  const [commentBeingEditted, setCommentBeingEditted] = useState<string | null>(
    null
  );
  const { data: session } = useSession();

  const commentsWithHTML = comments.map((comment) => {
    const content = generateHTML(comment.content as any, editorExtensions);
    return {
      ...comment,
      content,
    };
  });

  const commentContent = comments.find(
    (comment) => comment.id === commentBeingEditted
  )?.content;

  const editor = useEditor({
    extensions: editorExtensions,
    content: "",
  });

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(commentContent as any);
  }, [commentContent]);

  const handleStartEdit = (id: string) => {
    setCommentBeingEditted(id);
  };

  const handleDone = (id: string) => {
    const content = editor?.getJSON();
    if (!content) return;
    handleDoneEdit(id, content);
    setCommentBeingEditted(null);
  };

  return (
    <div className={styles.container}>
      {commentsWithHTML.map((comment) => {
        const author = comment.author;
        const user = session?.user as userFields;
        const isUserAuthor = user?.id === author.id;
        return (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.user}>
                <UserAvatar user={author} />
                <div className={styles.nameAndTime}>
                  <p className={styles.author}>{author.name}</p>
                  <p className={styles.time}>
                    {formatTimeAgo(new Date(comment.createdAt))}
                  </p>
                </div>
              </div>
              {isUserAuthor && (
                <div className={styles.iconButtons}>
                  {commentBeingEditted === comment.id ? (
                    <IconButton
                      onClick={() => handleDone(comment.id)}
                      icon={doneIcon}
                      alt="done"
                    />
                  ) : (
                    <IconButton
                      onClick={() => handleStartEdit(comment.id)}
                      icon={editIcon}
                      alt="edit"
                    />
                  )}
                  <IconButton
                    onClick={() => handleDelete(comment.id)}
                    icon={deleteIcon}
                    alt="delete"
                  />
                </div>
              )}
            </div>
            <div className={styles.editor}>
              {commentBeingEditted === comment.id ? (
                <CommentEditor
                  className={
                    isUserAuthor ? styles.userComment : styles.commentContent
                  }
                  editor={editor}
                />
              ) : (
                <div className={editorStyles.editor}>
                  <div
                    className={
                      isUserAuthor ? styles.userComment : styles.commentContent
                    }
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
