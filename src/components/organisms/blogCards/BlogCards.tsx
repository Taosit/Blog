import { HslColorType } from "@/types/types";
import React, { Suspense } from "react";
import { Card } from "../card/Card";
import { CardLoader } from "../cardLoader/CardLoader";
import { getAllPosts } from "@/lib/dbActions";
import styles from "./BlogCards.module.css";
type SearchParamsType = {
  search?: string;
  course?: string;
  term?: string;
  sort?: string;
  userId?: string;
};

type BlogCardType = {
  searchParams: SearchParamsType;
  showAuthor?: boolean;
};

type PostType = {
  id: string;
  title: string;
  tags: string[];
  author?: {
    name: string;
    image: string;
    color: HslColorType;
  };
  createdAt: string;
  coverType: "COLOR" | "IMAGE";
  image: string | null;
  color: HslColorType;
};

export const BlogCards = ({
  searchParams = {},
  showAuthor = true,
}: BlogCardType) => {
  const blogsPromise = getAllPosts(searchParams);

  return (
    <Suspense fallback={<LoadingCards />}>
      {/* @ts-expect-error Server Component */}
      <Blogs blogsPromise={blogsPromise} showAuthor={showAuthor} />
    </Suspense>
  );
};

type BlogsType = {
  blogsPromise: Promise<PostType[]>;
  showAuthor: boolean;
};

async function Blogs({ blogsPromise, showAuthor }: BlogsType) {
  const blogs = await blogsPromise;
  return (
    <div className={styles.container}>
      {blogs.map((blog) => (
        <Card key={blog.id} showAuthor={showAuthor} {...blog} />
      ))}
    </div>
  );
}

function LoadingCards() {
  return (
    <div className={styles.container}>
      {[...Array(6)].map((_, i) => (
        <CardLoader key={i} />
      ))}
    </div>
  );
}
