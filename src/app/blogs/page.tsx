import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { TopBar } from "@/components/organisms/topBar/TopBar";
import React from "react";

type searchParamsProps = {
  searchParams: {
    search?: string;
    class?: string;
    year?: string;
  };
};

const Blogs = ({ searchParams }: searchParamsProps) => {
  console.log(searchParams);
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
