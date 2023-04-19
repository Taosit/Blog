"use client";

import { trpc } from "@/providers/TrpcProvider";
import { Prisma, User } from "@prisma/client";
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
  const { data: fetchedComments } = trpc.comments.getComments.useQuery(postId);
  const createCommentMutation = trpc.comments.createComment.useMutation();
  const updateCommentMutation = trpc.comments.updateComment.useMutation();
  const deleteCommentMutation = trpc.comments.deleteComment.useMutation();

  useEffect(() => {
    if (!fetchedComments) return;
    setComments(fetchedComments);
  }, [fetchedComments]);

  const handleDelete = (id: string) => {
    deleteCommentMutation.mutateAsync(id).then(() => {
      setComments(comments.filter((comment) => comment.id !== id));
    });
  };

  const handleSend = (content: object) => {
    if (!session?.user) return;
    createCommentMutation
      .mutateAsync({ postId, comment: JSON.stringify(content) })
      .then((res) => {
        setComments([res, ...comments]);
      });
  };

  const handleDoneEdit = (id: string, content: object) => {
    if (!session?.user) return;
    updateCommentMutation
      .mutateAsync({ commentId: id, content: JSON.stringify(content) })
      .then((res) => {
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
