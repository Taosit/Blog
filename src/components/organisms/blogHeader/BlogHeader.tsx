"use client";

import { toColorString } from "@/lib/helpers";
import { HslColorType, userFields } from "@/types/types";
import { Post, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./BlogHeader.module.css";

type PostType = Post & {
  author: User;
};

export default function BlogHeader({
  postPromise,
}: {
  postPromise: Promise<any>;
}) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<PostType>>({});

  const { data, status } = useSession();
  useEffect(() => {
    if (!postPromise) return;
    postPromise.then((post) => {
      setPost(post);
    });
  }, [postPromise]);

  const user = data?.user as userFields;
  const isAuthor = data && data.user && user.id === post.authorId;

  const style = {
    ...(post.coverType &&
      post.coverType === "IMAGE" && {
        backgroundImage: `url(${post.image})`,
      }),
    ...(post.coverType &&
      post.coverType === "COLOR" && {
        backgroundColor: toColorString(post.color as HslColorType),
      }),
  };

  return (
    <div style={style} className={styles.container}>
      <button onClick={() => router.back()}>Back</button>
      {post.title && <h1>{post.title}</h1>}
      <div>
        {isAuthor ? (
          <div>
            <Link href={`/blogs/${post.id}/edit`}>Edit</Link>
            <button>Delete</button>
          </div>
        ) : (
          post.author && <div>{post.author.name}</div>
        )}
      </div>
    </div>
  );
}
