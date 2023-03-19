import ProtectedRoute from "@/components/atoms/protectedRoute/ProtectedRoute";
import React from "react";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const NewBlog = async () => {
  await delay(1000);
  return <div>NewBlog</div>;
};

const ProtectedNewBlog = async () => {
  return (
    <ProtectedRoute>
      {/* @ts-expect-error Server Component */}
      <NewBlog />
    </ProtectedRoute>
  );
};

export default ProtectedNewBlog;
