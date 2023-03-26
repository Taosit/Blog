import { BlogCards } from "@/components/organisms/blogCards/BlogCards";
import { Filters } from "@/components/organisms/filters/Filters";
import { HomeTopBar } from "@/components/organisms/homeTopBar/HomeTopBar";
import { getCoursesAndSemesters } from "@/lib/dbActions";

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
        <BlogCards searchParams={searchParams} />
      </main>
    </>
  );
};

export default Blogs;
