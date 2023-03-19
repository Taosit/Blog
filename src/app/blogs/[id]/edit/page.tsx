import ProtectedRoute from "@/components/atoms/protectedRoute/ProtectedRoute";
import React from "react";

const EditBlog = async () => {
  return <div>EditBlog</div>;
};

const ProtectedNewBlog = async () => {
  return (
    <ProtectedRoute>
      {/* @ts-expect-error Server Component */}
      <EditBlog />
    </ProtectedRoute>
  );
};

export default ProtectedNewBlog;
