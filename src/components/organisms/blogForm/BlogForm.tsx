import TagsInputGroup from "@/components/atoms/tagsInputGroup/TagsInputGroup";
import { formatClass, isCourseValid } from "@/lib/helpers";
import { draftPostType, savedPostType } from "@/types/types";
import React, { useState } from "react";
import BlogCover from "../blogCover/BlogCover";
import Tiptap from "../tipTap/TipTap";
import styles from "./BlogForm.module.css";

type BlogFormProps = {
  blog: draftPostType;
  setBlog: React.Dispatch<React.SetStateAction<draftPostType>>;
};

export function BlogForm({ blog, setBlog }: BlogFormProps) {
  const capitalize = (str: string) => {
    return str.replace(str[0], str[0].toUpperCase());
  };
  const [classError, setClassError] = useState("");
  // const [className, setClassName] = useState(blog.class || "");

  const validateClass = () => {
    const className = blog.class;
    if (className.length === 0) {
      setClassError("Class cannot be empty");
      return;
    }
    if (!isCourseValid(className)) {
      setClassError("Invalid class");
      return;
    }
    const formattedClass = formatClass(className).toUpperCase();
    setBlog((prev) => ({ ...prev, class: formattedClass }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassError("");
    setBlog((prev) => ({ ...prev, class: e.target.value }));
  };

  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <div className={`${styles.textInputGroup} ${styles.inputGroup}`}>
          <label htmlFor="class">Class</label>
          <input
            value={blog.class}
            onChange={handleChange}
            onBlur={validateClass}
            type="text"
            id="class"
          />
          <p className={styles.error}>{classError}</p>
        </div>
        <TagsInputGroup
          className={styles.inputGroup}
          label="Tags"
          value={blog.tags}
          setTags={(tags) => setBlog((prev) => ({ ...prev, tags }))}
          formatEach={capitalize}
        />
      </div>
      <div className={styles.row}>
        <BlogCover blog={blog} setBlog={setBlog} />
      </div>
      <div className={styles.row}>
        <Tiptap />
      </div>
    </form>
  );
}
