import { blogs } from "@/seeds/blogs";
import React from "react";
import { Card } from "../card/Card";
import styles from "./BlogCards.module.css";

export const BlogCards = () => {
  return (
    <div className={styles.container}>
      {blogs.map((blog) => (
        <Card key={blog.id} {...blog} />
      ))}
    </div>
  );
};
