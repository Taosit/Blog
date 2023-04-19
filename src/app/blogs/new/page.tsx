"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import {
  coverType,
  draftPostType,
  savedPostType,
  userFields,
} from "@/types/types";
import { Class } from "@prisma/client";
import { useEditor } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import styles from "./NewBlog.module.css";
import { editorExtensions } from "@/lib/editorConfig";
import { trpc } from "@/providers/TrpcProvider";

const NewBlog = () => {
  const initialBlog = {
    class: "",
    title: "",
    coverType: "COLOR" as coverType,
    color: { h: 170, s: 80, l: 80 },
    image: "",
    tags: ["Tag"],
  };

  const [blog, setBlog] = useState<draftPostType>(initialBlog);
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });

  const [, startTransition] = useTransition();

  const userId = (session?.user as userFields)?.id;
  const { data: user } = trpc.user.getUser.useQuery(
    {
      userId: userId,
    },
    { enabled: !!session }
  );

  const { data: savedPost } = trpc.savedPost.get.useQuery({ userId });
  const savedPostMutation = trpc.savedPost.update.useMutation();
  const newPostMutation = trpc.posts.createPost.useMutation();

  const editor = useEditor({
    extensions: editorExtensions,
    content: blog.content || "<p>Start creating your blog ...</p>",
  });

  useEffect(() => {
    if (!session?.user) return;
    if (!editor) return;
    if (savedPost) {
      const { id, classId, class: classInfo, userId, ...post } = savedPost;
      setBlog({ ...post, class: classInfo?.name?.toUpperCase() ?? "" });
      if (post.content) {
        editor?.commands.setContent(post.content as object);
      }
    } else if (user?.classes && user.classes.length > 0) {
      const course = user.classes[0] as Class;
      setBlog({ ...initialBlog, class: course.name.toUpperCase() });
    }
  }, [session?.user, savedPost, editor?.getJSON().type]);

  const save = async (blog: draftPostType | null) => {
    if (!session?.user) return;
    const content = editor?.getJSON();
    const blogToSave = blog
      ? {
          ...blog,
          content: content ? JSON.stringify(content) : undefined,
          authorId: userId,
        }
      : undefined;
    savedPostMutation.mutateAsync({ userId, post: blogToSave });
    router.push(`/user/${userId}`);
  };

  const publish = async () => {
    if (!session?.user) return;
    const content = editor?.getJSON();
    if (!content) return;
    const blogToSave = {
      ...blog,
      content: content ? JSON.stringify(content) : undefined,
      authorId: userId,
    } as savedPostType;
    await newPostMutation.mutateAsync({ userId, post: blogToSave });
    router.push(`/user/${userId}`);
    setTimeout(() => {
      router.refresh();
    }, 100);
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
