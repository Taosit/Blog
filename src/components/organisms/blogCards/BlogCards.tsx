import { HslColorType } from "@/types/types";
import { CoverType, Prisma } from "@prisma/client";
import React from "react";
import { Card } from "../card/Card";
import styles from "./BlogCards.module.css";

type userPost = {
  id: string;
  title: string;
  createdAt: string;
  coverType: CoverType;
  color: HslColorType;
  image: string | null;
  classId: string;
  tags: string[];
  content: Prisma.JsonValue;
  authorId: string;
};

type BlogCardType = {
  promise: Promise<userPost[]>;
  showAuthor?: boolean;
};

export const BlogCards = async ({
  promise,
  showAuthor = true,
}: BlogCardType) => {
  const blogs = await promise;
  return (
    <div className={styles.container}>
      {blogs.map((blog) => (
        <Card key={blog.id} showAuthor={showAuthor} {...blog} />
      ))}
    </div>
  );
};
