"use client";

import { formatDate, toColorString } from "@/lib/helpers";
import { HslColorType, userFields } from "@/types/types";
import { useSession } from "next-auth/react";
import doubleLeft from "./double-left.svg";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./BlogHeader.module.css";
import UserAvatar from "@/components/atoms/userAvatar/UserAvatar";
import { trpc } from "@/providers/TrpcProvider";
import { Post, User } from "@prisma/client";

type HeaderProps = {
  postPromise: Promise<any>;
};

type PostType = Post & {
  id: string;
  author: User;
  createdAt: string;
};

export default function BlogHeader({ postPromise }: HeaderProps) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<PostType>>({});

  const { data } = useSession();
  const deletePostMutation = trpc.posts.deletePost.useMutation();

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

  const deletePost = async () => {
    if (!user?.id || !post.id) return;
    const deleted = await deletePostMutation.mutateAsync(post.id);
    if (deleted) {
      router.push(`/user/${user.id}`);
      router.refresh();
    }
  };

  return (
    <div style={style} className={styles.container}>
      <div className={styles.content}>
        <button className={styles.backLink} onClick={() => router.back()}>
          <Image src={doubleLeft} alt="" />
          <p>Back</p>
        </button>
        {post.title && <h1 className={styles.title}>{post.title}</h1>}
        <div className={styles.bottomRightContainer}>
          {isAuthor ? (
            <div className={styles.controls}>
              <Link href={`/blogs/${post.id}/edit`}>Edit</Link>
              <button onClick={deletePost}>Delete</button>
            </div>
          ) : (
            post.author && (
              <div className={styles.authorContainer}>
                <UserAvatar user={post.author} size="small" />
                <p>
                  {post.author.firstName} {post.author.lastName}
                </p>
              </div>
            )
          )}
        </div>
        {post.createdAt && (
          <p className={styles.date}>{formatDate(post.createdAt)}</p>
        )}
      </div>
    </div>
  );
}
