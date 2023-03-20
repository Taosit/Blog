"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import { fetchSavedPost, fetchUserClasses, savePost } from "@/lib/api";
import { coverType, savedPostType, userFields } from "@/types/types";
import { Class } from "@prisma/client";
import { useSession } from "next-auth/react";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./NewBlog.module.css";

const NewBlog = () => {
  const initialBlog = {
    class: null,
    title: "",
    coverType: "COLOR" as coverType,
    color: { h: 0, s: 0, l: 100 },
    image: "",
    tags: [],
    content: {},
  };

  const [blog, setBlog] = useState<savedPostType>(initialBlog);
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  useEffect(() => {
    if (!session?.user) {
      return;
    }
    const user = session.user as userFields;
    fetchSavedPost(user.id)
      .then((data) => {
        if (data) {
          const { id, classId, userId, ...post } = data;
          setBlog(post);
        } else {
          return fetchUserClasses(user.id);
        }
      })
      .then((classes) => {
        if (classes && classes.length > 0) {
          const course = classes[0] as Class;
          setBlog((prev) => ({ ...prev, class: course }));
        }
      });
  }, [status, session]);

  const save = async () => {
    if (!session?.user) return;
    const user = session.user as userFields;
    await savePost(user.id, blog);
    router.push(`/user/${user.id}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={save}>
        Save and close
      </button>
      <BlogForm blog={blog} />
      <div className={styles.buttonContainer}>
        <button className={styles.saveButton} onClick={save}>
          Save
        </button>
        <button className={styles.discardButton}>Discard</button>
        <Button className={styles.publishButton}>Publish</Button>
      </div>
    </div>
  );
};

// const ProtectedNewBlog = () => {
//   return (
//     <ProtectedRoute>
//       <NewBlog />
//     </ProtectedRoute>
//   );
// };

export default NewBlog;
