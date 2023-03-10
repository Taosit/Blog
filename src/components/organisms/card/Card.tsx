import React from "react";
import { DefaultAvatar } from "@/components/atoms/defaultAvatar/DefaultAvatar";
import Image from "next/image";
import styles from "./Card.module.css";
import { darkenColor } from "@/lib/helpers";

type CardProps = {
  title: string;
  tags: string[];
  author?: {
    name: string;
    avatar: string;
    color: string;
  };
  date: string;
  image: string;
  color: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Card = ({
  title,
  tags,
  author,
  date,
  image,
  color,
  ...props
}: CardProps) => {
  return (
    <article className={styles.card} {...props}>
      <div className={styles.cardTop}>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.tagContainer}>
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className={styles.date}>{date}</p>
      </div>
      <div
        className={styles.cardBottom}
        style={
          image
            ? { backgroundImage: `url(${image})` }
            : { backgroundColor: color }
        }
      >
        {author && (
          <div>
            {author.avatar === "" ? (
              <DefaultAvatar
                className={styles.avatar}
                color={darkenColor(author.color)}
                height={64}
                width={64}
              />
            ) : (
              <Image
                className={styles.avatar}
                src={author.avatar}
                height={64}
                width={64}
                alt="avatar"
              />
            )}
            <p className={styles.author}>{author.name}</p>
          </div>
        )}
      </div>
    </article>
  );
};
