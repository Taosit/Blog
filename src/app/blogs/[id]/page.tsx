import React from "react";

const Blog = ({ params }: { params: { id: string } }) => {
  return <div>Blog {params.id}</div>;
};

export default Blog;
