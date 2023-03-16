import { blogType } from "@/types/types";
import React from "react";
import { Card } from "../card/Card";
import styles from "./BlogCards.module.css";

type BlogCardType = {
  promise: Promise<blogType[]>;
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
