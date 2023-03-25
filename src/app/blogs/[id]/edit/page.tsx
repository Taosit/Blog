"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import { fetchPost, updateBlog } from "@/lib/api";
import { coverType, draftPostType, userFields } from "@/types/types";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./EditBlog.module.css";

const EditBlog = ({ params }: { params: { id: string } }) => {
  const initialBlog = {
    class: "",
    title: "",
    coverType: "COLOR" as coverType,
    color: { h: 170, s: 80, l: 80 },
    image: "",
    tags: [],
  };

  const [blog, setBlog] = useState<draftPostType>(initialBlog);
  const [authorId, setAuthorId] = useState<string>("");

  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });
  const user = session?.user as userFields;

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
    fetchPost(params.id).then((data) => {
      if (data) {
        const {
          id,
          classId,
          class: classInfo,
          authorId,
          author,
          comments,
          ...post
        } = data;
        if (user.id !== authorId) {
          router.push(`/blogs/${params.id}`);
        }
        setAuthorId(authorId);
        setBlog({ ...post, class: classInfo.name.toUpperCase() });
        if (post.content) {
          editor?.commands.setContent(post.content);
        }
      }
    });
  }, [editor?.getJSON().type, params.id, session, user?.id]);

  const save = async () => {
    const content = editor?.getJSON();
    if (!content || user.id !== authorId) return;
    const blogToSave = { ...blog, content, authorId: user.id };
    await updateBlog(params.id, blogToSave);
    router.push(`/blogs/${params.id}`);
    router.refresh();
  };

  const cancel = () => {
    router.push(`/blogs/${params.id}`);
  };

  return (
    <div className={styles.container}>
      <button className={styles.topSaveButton} onClick={save}>
        Save
      </button>
      <BlogForm blog={blog} setBlog={setBlog} editor={editor} />
      <div className={styles.buttonContainer}>
        <button className={styles.discardButton} onClick={cancel}>
          Discard Changes
        </button>
        <Button className={styles.bottomSaveButton} onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditBlog;
