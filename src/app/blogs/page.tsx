import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { TopBar } from "@/components/organisms/topBar/TopBar";
import React from "react";
import styles from "./Blogs.module.css";

const Blogs = () => {
  return (
    <>
      <TopBar />
      <main>
        <Filters />
        <BlogCards />
      </main>
    </>
  );
};

export default Blogs;
