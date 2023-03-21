import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { HomeTopBar } from "@/components/organisms/homeTopBar/HomeTopBar";
import React, { Suspense } from "react";
import { blogs } from "@/seeds/blogs";
import { blogType } from "@/types/types";
import { getCoursesAndSemesters } from "@/lib/dbActions";
import { CardLoader } from "@/components/organisms/cardLoader/CardLoader";
import styles from "./Blogs.module.css";

type searchParamsProps = {
  searchParams: {
    search?: string;
    class?: string;
    year?: string;
  };
};

const getBlog = (): Promise<blogType[]> =>
  new Promise((res) => {
    setTimeout(() => {
      res(blogs);
    }, 1000);
  });

const Blogs = async ({ searchParams }: searchParamsProps) => {
  console.log(searchParams);
  const getFilters = getCoursesAndSemesters();
  return (
    <>
      <HomeTopBar />
      <main>
        <Filters getFilters={getFilters} />
        <Suspense fallback={<LoadingCards />}>
          {/* @ts-expect-error Server Component */}
          <BlogCards promise={getBlog()} />
        </Suspense>
      </main>
    </>
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

export default Blogs;
