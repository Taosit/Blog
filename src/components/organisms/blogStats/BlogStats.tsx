import styles from "./BlogStats.module.css";
import { Class, Post, User } from "@prisma/client";
import { getTerm } from "@/lib/helpers";
import Link from "next/link";

// type UserType = User & {
//   classes: Class[];
//   posts: Post[];
// };

type BlogStatsType = {
  postsPromise: Promise<any[]>;
};

export default async function BlogStats({ postsPromise }: BlogStatsType) {
  const posts = await postsPromise;
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
