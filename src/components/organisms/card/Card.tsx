import React from "react";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Image from "next/image";
import styles from "./Card.module.css";
import { darkenColor, formatDate, toColorString } from "@/lib/helpers";
import { HslColorType } from "@/types/types";
import Link from "next/link";

type CardProps = {
  id: string;
  title: string;
  tags: string[];
  author?: {
    name: string;
    image: string;
    color: HslColorType;
  };
  createdAt: string;
  coverType: "COLOR" | "IMAGE";
  image: string | null;
  color: HslColorType;
  showAuthor: boolean;
};

export const Card = ({
  id,
  title,
  tags,
  author,
  createdAt,
  coverType,
  image,
  color,
  showAuthor = true,
}: CardProps) => {
  const avatarDiameter = 72;

  return (
    <Link href={`/blogs/${id}`}>
      <article className={styles.card}>
        <div className={styles.cardTop}>
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.tagContainer}>
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className={styles.date}>{formatDate(createdAt)}</p>
        </div>
        <div
          className={styles.cardBottom}
          style={
            coverType === "IMAGE" && image
              ? { backgroundImage: `url(${image})` }
              : { backgroundColor: toColorString(color) }
          }
        >
          {showAuthor && author && (
            <div>
              {author.image === "" ? (
                <DefaultAvatar
                  className={styles.avatar}
                  color={darkenColor(author.color)}
                  height={avatarDiameter}
                  width={avatarDiameter}
                />
              ) : (
                <Image
                  className={styles.avatar}
                  src={author.image}
                  height={avatarDiameter}
                  width={avatarDiameter}
                  alt="avatar"
                />
              )}
              <p className={styles.author}>{author.name}</p>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};
