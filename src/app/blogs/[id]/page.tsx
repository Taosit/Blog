import BlogContent from "@/components/organisms/blogContent/BlogContent";
import BlogHeader from "@/components/organisms/blogHeader/BlogHeader";
import { getPost } from "@/lib/dbActions";
import React from "react";

const Blog = async ({ params }: { params: { id: string } }) => {
  const postId = params.id;
  const postPromise = getPost(postId);

  return (
    <div>
      <BlogHeader postPromise={postPromise} />
      {/* @ts-expect-error Server Component */}
      <BlogContent postPromise={postPromise} />
    </div>
  );
};

export default Blog;
