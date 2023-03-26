import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { HomeTopBar } from "@/components/organisms/homeTopBar/HomeTopBar";
import React, { Suspense } from "react";
import { getCoursesAndSemesters } from "@/lib/dbActions";
import { CardLoader } from "@/components/organisms/cardLoader/CardLoader";
import styles from "./Blogs.module.css";

type SearchParamsType = {
  search?: string;
  course?: string;
  term?: string;
  sort?: string;
};

type searchParamsProps = {
  searchParams: SearchParamsType;
};

const Blogs = ({ searchParams }: searchParamsProps) => {
  const getFilters = getCoursesAndSemesters();
  return (
    <>
      <HomeTopBar />
      <main>
        <Filters getFilters={getFilters} />
        <Suspense fallback={<LoadingCards />}>
          <BlogCards searchParams={searchParams} />
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
