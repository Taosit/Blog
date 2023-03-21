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
  await delay(1000);
  return user;
};

const Profile = async ({ id }: { id: string }) => {
  const getBlog = (): Promise<blogType[]> =>
    new Promise((res) => {
      setTimeout(() => {
        res(blogs);
      }, 2000);
    });
  const userPromise = getUser(id);

  return (
    <div>
      <TopBar userPromise={userPromise} />
      <div className={styles.column}>
        <UserCard userPromise={userPromise} />
        <Suspense fallback={<LoadingStats />}>
          {/* @ts-expect-error Server Component */}
          <BlogStats postsPromise={getBlog()} userId={id} />
        </Suspense>
      </div>
      <Suspense fallback={<LoadingCards />}>
        {/* @ts-expect-error Server Component */}
        <BlogCards promise={getBlog()} showAuthor={false} />
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
