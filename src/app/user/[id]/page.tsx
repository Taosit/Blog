import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import BlogStats from "@/components/organisms/blogStats/BlogStats";
import UserCard from "@/components/organisms/userCard/UserCard";
import TopBar from "@/components/organisms/topBar/TopBar";
import client from "@/lib/prismadb";
import { blogs } from "@/seeds/blogs";
import { blogType } from "@/types/types";
import React, { Suspense } from "react";
import styles from "./Profile.module.css";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/atoms/protectedRoute/ProtectedRoute";
import { CardLoader } from "@/components/organisms/cardLoader/CardLoader";
import { getUserPosts } from "@/lib/dbActions";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const getUser = async (id: string) => {
  const user = await client.user.findUnique({
    where: {
      id,
    },
    include: {
      posts: true,
      classes: true,
    },
  });
  if (!user) {
    notFound();
  }
  return user;
};

const getBlog = async (id: string) => {
  return getUserPosts(id);
};

const Profile = async ({ id }: { id: string }) => {
  const userPromise = getUser(id);
  const blogPromise = getBlog(id);

  return (
    <div className={styles.container}>
      <TopBar userPromise={userPromise} />
      <div className={styles.row}>
        <UserCard userPromise={userPromise} />
        <Suspense fallback={<LoadingStats />}>
          {/* @ts-expect-error Server Component */}
          <BlogStats postsPromise={blogPromise} />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingCards />}>
        {/* @ts-expect-error Server Component */}
        <BlogCards promise={blogPromise} showAuthor={false} />
      </Suspense>
    </div>
  );
};

function LoadingCards() {
  return (
    <div className={styles.cardsContainer}>
      {[...Array(6)].map((_, i) => (
        <CardLoader key={i} />
      ))}
    </div>
  );
}

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

const ProtectedProfile = async ({ params }: { params: { id: string } }) => {
  return (
    <ProtectedRoute>
      {/* @ts-expect-error Server Component */}
      <Profile id={params.id} />
    </ProtectedRoute>
  );
};

export default ProtectedProfile;
