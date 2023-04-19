"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import { editorExtensions } from "@/lib/editorConfig";
import { trpc } from "@/providers/TrpcProvider";
import {
  coverType,
  draftPostType,
  savedPostType,
  userFields,
} from "@/types/types";
import { useEditor } from "@tiptap/react";
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
  const { data: post } = trpc.posts.getPost.useQuery(params.id);
  const updatePostMutation = trpc.posts.updatePost.useMutation();

  const user = session?.user as userFields;

  const editor = useEditor({
    extensions: editorExtensions,
    content: blog.content || "<p>Start creating your blog ...</p>",
  });

  useEffect(() => {
    if (!session?.user) return;
    if (!editor) return;
    if (!post) return;
    const {
      id,
      classId,
      class: classInfo,
      authorId,
      author,
      comments,
      ...rest
    } = post;
    if (user.id !== authorId) {
      router.push(`/blogs/${params.id}`);
    }
    setAuthorId(authorId);
    setBlog({ ...rest, class: classInfo.name.toUpperCase() });
    if (rest.content) {
      editor?.commands.setContent(rest.content as object);
    }
  }, [editor?.getJSON().type, post, params.id, session, user?.id]);

  const save = async () => {
    const content = editor?.getJSON();
    if (!content || user.id !== authorId) return;
    const blogToSave = {
      ...blog,
      content: content ? JSON.stringify(content) : undefined,
      authorId: user.id,
    } as savedPostType;
    await updatePostMutation.mutateAsync({
      postId: params.id,
      post: blogToSave,
    });
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
