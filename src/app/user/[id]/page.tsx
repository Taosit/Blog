import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import BlogStats from "@/components/organisms/blogStats/BlogStats";
import UserCard from "@/components/organisms/userCard/UserCard";
import TopBar from "@/components/organisms/topBar/TopBar";
import client from "@/lib/prismadb";
import { blogs } from "@/seeds/blogs";
import { blogType } from "@/types/types";
import React from "react";
import styles from "./Profile.module.css";
import { notFound } from "next/navigation";
import ProtectedRoute from "@/components/atoms/protectedRoute/ProtectedRoute";

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

const Profile = async ({ id }: { id: string }) => {
  const getBlog = (): Promise<blogType[]> => new Promise((res) => res(blogs));
  const user = await getUser(id);

  return (
    <div>
      <TopBar user={user} />
      <div className={styles.column}>
        <UserCard user={user} />
        <BlogStats posts={user.posts} userId={id} />
      </div>
      {/* @ts-expect-error Server Component */}
      <BlogCards promise={getBlog()} showAuthor={false} />\
    </div>
  );
};

const ProtectedProfile = async ({ params }: { params: { id: string } }) => {
  return (
    <ProtectedRoute>
      {/* @ts-expect-error Server Component */}
      <Profile id={params.id} />
    </ProtectedRoute>
  );
};

export default ProtectedProfile;
