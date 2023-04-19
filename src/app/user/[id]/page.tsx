import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import BlogStats from "@/components/organisms/blogStats/BlogStats";
import UserCard from "@/components/organisms/userCard/UserCard";
import TopBar from "@/components/organisms/topBar/TopBar";
import React, { Suspense } from "react";
import styles from "./Profile.module.css";
import ProtectedRoute from "@/components/atoms/protectedRoute/ProtectedRoute";
import { getUserPosts } from "@/lib/dbActions";

const Profile = ({ id }: { id: string }) => {
  const blogPromise = getUserPosts(id);

  return (
    <div className={styles.container}>
      <TopBar userId={id} />
      <div className={styles.row}>
        <UserCard userId={id} />
        <Suspense fallback={<LoadingStats />}>
          {/* @ts-expect-error Server Component */}
          <BlogStats postsPromise={blogPromise} />
        </Suspense>
      </div>
      <BlogCards searchParams={{ userId: id }} showAuthor={false} />
    </div>
  );
};

function LoadingStats() {
  return (
    <div className={styles.statsContainer}>
      <div className={styles.stats}>
        <div className={styles.stat}></div>
        <div className={styles.stat}></div>
      </div>
    </div>
  );
}

const ProtectedProfile = ({ params }: { params: { id: string } }) => {
  return (
    <ProtectedRoute>
      <Profile id={params.id} />
    </ProtectedRoute>
  );
};

export default ProtectedProfile;
