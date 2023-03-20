import React from "react";
import styles from "./BlogStats.module.css";
import { Post } from "@prisma/client";
import { getTerm } from "@/lib/helpers";
import Link from "next/link";

type BlogStatsType = {
  posts: Post[];
  userId: string;
};

export default function BlogStats({ posts, userId }: BlogStatsType) {
  return (
    <div className={styles.container}>
      <Link href="/blogs/new" className={styles.buttonLink}>
        New Post
      </Link>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <span className={styles.number}>{posts.length}</span>
          <span className={styles.statText}>Posts in {getTerm()}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.number}>{posts.length}</span>
          <span className={styles.statText}>Total posts</span>
        </div>
      </div>
    </div>
  );
}
