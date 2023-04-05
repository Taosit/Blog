"use client";

import { fetchPosts } from "@/lib/api";
import { HslColorType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { Card } from "../card/Card";
import { CardLoader } from "../cardLoader/CardLoader";
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
  const [blogs, setBlogs] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchPosts(searchParams).then((data) => {
      setBlogs(data);
      setIsLoading(false);
    });
  }, [searchParams]);

  if (isLoading) {
    return <LoadingCards />;
  }

  return (
    <div className={styles.container}>
      {blogs.map((blog) => (
        <Card key={blog.id} showAuthor={showAuthor} {...blog} />
      ))}
    </div>
  );
};

function LoadingCards() {
  return (
    <div className={styles.container}>
      {[...Array(6)].map((_, i) => (
        <CardLoader key={i} />
      ))}
    </div>
  );
}
