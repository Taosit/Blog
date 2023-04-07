"use client";
import { Comment, Prisma, User } from "@prisma/client";
import { generateHTML } from "@tiptap/html";
import styles from "./Comments.module.css";
import NextImage from "next/image";
import editorStyles from "@/styles/editor.module.css";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import { darkenColor, formatDate } from "@/lib/helpers";
import { HslColorType } from "@/types/types";
import editIcon from "./edit.svg";
import deleteIcon from "./delete.svg";
import doneIcon from "./done.svg";
import { useEffect, useState } from "react";
import { editorExtensions } from "@/lib/editorConfig";
import CommentEditor from "../commentEditor/CommentEditor";
import { useEditor } from "@tiptap/react";

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
  const avatarDiameter = 72;
  const [commentBeingEditted, setCommentBeingEditted] = useState<string | null>(
    null
  );

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
        return (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.user}>
                {author.image ? (
                  <NextImage
                    className={styles.avatar}
                    src={author.image}
                    height={avatarDiameter}
                    width={avatarDiameter}
                    alt="avatar"
                  />
                ) : (
                  <DefaultAvatar
                    className={styles.avatar}
                    color={darkenColor(author.color as HslColorType)}
                    height={avatarDiameter}
                    width={avatarDiameter}
                  />
                )}
                <div className={styles.nameAndTime}>
                  <p className={styles.author}>{author.name}</p>
                  <p className={styles.time}>{formatDate(comment.createdAt)}</p>
                </div>
              </div>
              <div className={styles.iconButtons}>
                {commentBeingEditted === comment.id ? (
                  <button
                    onClick={() => handleDone(comment.id)}
                    className={styles.iconButton}
                  >
                    <NextImage
                      src={doneIcon}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(comment.id)}
                    className={styles.iconButton}
                  >
                    <NextImage
                      src={editIcon}
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className={styles.iconButton}
                >
                  <NextImage
                    src={deleteIcon}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </div>
            <div className={`${styles.editor} ${editorStyles.editor}`}>
              {commentBeingEditted === comment.id ? (
                <CommentEditor editor={editor} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: comment.content }} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
