import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { HomeTopBar } from "@/components/organisms/homeTopBar/HomeTopBar";
import React, { Suspense } from "react";
import { blogs } from "@/seeds/blogs";
import { blogType } from "@/types/types";

type searchParamsProps = {
  searchParams: {
    search?: string;
    class?: string;
    year?: string;
  };
};

const Blogs = ({ searchParams }: searchParamsProps) => {
  console.log(searchParams);
  const getBlog = (): Promise<blogType[]> => new Promise((res) => res(blogs));

  return (
    <>
      <HomeTopBar />
      <main>
        <Filters />
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <BlogCards promise={getBlog()} />
        </Suspense>
      </main>
    </>
  );
};

export default Blogs;
