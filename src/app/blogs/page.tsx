import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { HomeTopBar } from "@/components/organisms/homeTopBar/HomeTopBar";
import React, { Suspense } from "react";
import { blogs } from "@/seeds/blogs";
import { blogType } from "@/types/types";
import { fetchCoursesAndSemesters, fetchSavedPost } from "@/lib/api";

type searchParamsProps = {
  searchParams: {
    search?: string;
    class?: string;
    year?: string;
  };
};

const Blogs = async ({ searchParams }: searchParamsProps) => {
  console.log(searchParams);
  const getBlog = (): Promise<blogType[]> => new Promise((res) => res(blogs));
  const getFilters = fetchCoursesAndSemesters();
  return (
    <>
      <HomeTopBar />
      <main>
        <Filters getFilters={getFilters} />
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <BlogCards promise={getBlog()} />
        </Suspense>
      </main>
    </>
  );
};

export default Blogs;
