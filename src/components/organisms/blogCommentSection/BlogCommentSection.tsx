import React from "react";
import CommentBox from "../commentBox/CommentBox";
import Comments from "../comments/Comments";
import styles from "./BlogCommentSection.module.css";

type CommentSectionProps = {
  postId: string;
};

export default function BlogCommentSection({ postId }: CommentSectionProps) {
  return (
    <section className={styles.container}>
      <h2>Comments</h2>
      <CommentBox />
      <Comments postId={postId} />
    </section>
  );
}
