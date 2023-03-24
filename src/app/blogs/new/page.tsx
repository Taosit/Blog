"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import {
  fetchSavedPost,
  fetchUserClasses,
  publishBlog,
  savePost,
} from "@/lib/api";
import { coverType, draftPostType, userFields } from "@/types/types";
import { Class } from "@prisma/client";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./NewBlog.module.css";

const NewBlog = () => {
  const initialBlog = {
    class: "",
    title: "",
    coverType: "COLOR" as coverType,
    color: { h: 170, s: 80, l: 80 },
    image: "",
    tags: [],
    // content: {},
  };

  const [blog, setBlog] = useState<draftPostType>(initialBlog);
  const router = useRouter();
  const { status, data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link,
      Image,
      Youtube,
    ],
    content: blog.content || "<p>Start creating your blog ...</p>",
  });

  useEffect(() => {
    if (!session?.user) return;
    if (!editor) return;
    const user = session.user as userFields;
    fetchSavedPost(user.id)
      .then((data) => {
        if (data) {
          const { id, classId, class: classInfo, userId, ...post } = data;
          setBlog({ ...post, class: classInfo.name.toUpperCase() });
          if (post.content) {
            editor?.commands.setContent(post.content);
          }
        } else {
          return fetchUserClasses(user.id);
        }
      })
      .then((classes) => {
        if (classes && classes.length > 0) {
          const course = classes[0] as Class;
          setBlog((prev) => {
            return { ...prev, class: course.name.toUpperCase() };
          });
        }
      });
  }, [status, session, editor?.getJSON().type]);

  const save = async (blog: draftPostType | null) => {
    if (!session?.user) return;
    const content = editor?.getJSON();
    const user = session.user as userFields;
    const blogToSave = blog ? { ...blog, content } : null;
    await savePost(user.id, blogToSave);
    router.push(`/user/${user.id}`);
  };

  const publish = async () => {
    if (!session?.user) return;
    const content = editor?.getJSON();
    if (!content) return;
    const user = session.user as userFields;
    const blogToSave = { ...blog, content };
    await publishBlog(user.id, blogToSave);
    router.refresh();
    router.push(`/user/${user.id}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.closeButton} onClick={() => save(blog)}>
        Save and close
      </button>
      <BlogForm blog={blog} setBlog={setBlog} editor={editor} />
      <div className={styles.buttonContainer}>
        <button className={styles.saveButton} onClick={() => save(blog)}>
          Save
        </button>
        <button className={styles.discardButton} onClick={() => save(null)}>
          Discard
        </button>
        <Button className={styles.publishButton} onClick={publish}>
          Publish
        </Button>
      </div>
    </div>
  );
};

export default NewBlog;
