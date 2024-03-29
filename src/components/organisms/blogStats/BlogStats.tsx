import styles from "./BlogStats.module.css";
import { getTerm } from "@/lib/helpers";
import { Post } from "@prisma/client";
import Link from "next/link";

type BlogStatsType = {
  postsPromise: Promise<Post[]>;
};

export default async function BlogStats({ postsPromise }: BlogStatsType) {
  const posts = await postsPromise;
  const postsThisTerm = posts
    .map((post) => {
      return {
        ...post,
        createdAt: new Date(post.createdAt),
      };
    })
    .filter((post) => {
      return getTerm(post.createdAt) === getTerm();
    });

  return (
    <div className={styles.container}>
      <Link href="/blogs/new" className={styles.buttonLink}>
        New Post
      </Link>
      <div className={styles.statsContainer}>
        <div className={styles.stat}>
          <span className={styles.number}>{postsThisTerm.length}</span>
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
