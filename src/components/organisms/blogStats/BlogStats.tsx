"use client";

import React from "react";
import styles from "./BlogStats.module.css";
import { Post } from "@prisma/client";
import { Button } from "@/components/atoms/button/Button";
import { getTerm } from "@/lib/helpers";

type BlogStatsType = {
  posts: Post[];
  userId: string;
};

export default function BlogStats({ posts, userId }: BlogStatsType) {
  return (
    <div className={styles.container}>
      <Button size="large">New Post</Button>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <span className={styles.number}>{posts.length}</span>
          <span>Posts in {getTerm()}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{posts.length}</span>
          <span>Total posts</span>
        </div>
      </div>
    </div>
  );
}
