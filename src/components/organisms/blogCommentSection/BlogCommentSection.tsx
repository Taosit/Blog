"use client";

import {
  deleteComment,
  editComment,
  fetchComments,
  sendComment,
} from "@/lib/api";
import { Comment, Prisma, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CommentBox from "../commentBox/CommentBox";
import Comments from "../comments/Comments";
import styles from "./BlogCommentSection.module.css";

type CommentSectionProps = {
  postId: string;
};

type CommentType = {
  id: string;
  createdAt: string;
  content: Prisma.JsonValue;
  authorId: string;
  postId: string;
  author: User;
};

export default function BlogCommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const { status, data: session } = useSession();

  useEffect(() => {
    fetchComments(postId).then((comments) => setComments(comments));
  }, [postId]);

  const handleDelete = (id: string) => {
    deleteComment(postId, id).then(() => {
      setComments(comments.filter((comment) => comment.id !== id));
    });
  };

  const handleSend = (content: object) => {
    if (!session?.user) return;
    sendComment(postId, content).then((res) => {
      setComments([...comments, res]);
    });
  };

  const handleDoneEdit = (id: string, content: object) => {
    if (!session?.user) return;
    editComment(postId, id, content).then((res) => {
      setComments(
        comments.map((comment) => {
          if (comment.id === id) {
            return res;
          }
          return comment;
        })
      );
    });
  };

  return (
    <section className={styles.container}>
      <h2>Comments</h2>
      {status === "authenticated" && <CommentBox handleSend={handleSend} />}
      <Comments
        comments={comments}
        handleDelete={handleDelete}
        handleDoneEdit={handleDoneEdit}
      />
    </section>
  );
}
