import TagsInputGroup from "@/components/atoms/tagsInputGroup/TagsInputGroup";
import { formatClass, isCourseValid } from "@/lib/helpers";
import { draftPostType } from "@/types/types";
import { Editor } from "@tiptap/react";
import React, { useState } from "react";
import BlogCover from "../blogCover/BlogCover";
import Tiptap from "../tipTap/TipTap";
import styles from "./BlogForm.module.css";

type BlogFormProps = {
  blog: draftPostType;
  setBlog: React.Dispatch<React.SetStateAction<draftPostType>>;
  editor: Editor | null;
};

export function BlogForm({ blog, setBlog, editor }: BlogFormProps) {
  const capitalize = (str: string) => {
    return str.replace(str[0], str[0].toUpperCase());
  };
  const [classError, setClassError] = useState("");
  const [titleError, setTitleError] = useState("");

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

  const validateTitle = () => {
    const title = blog.title;
    if (title.length === 0) {
      setTitleError("Title cannot be empty");
      return;
    }
    if (title.length > 100) {
      setTitleError("Title cannot be longer than 100 characters");
      return;
    }
    setBlog((prev) => ({ ...prev, title }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassError("");
    setBlog((prev) => ({ ...prev, class: e.target.value }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleError("");
    setBlog((prev) => ({ ...prev, title: e.target.value }));
  };

  return (
    <form className={styles.form}>
      <div className={`${styles.textInputGroup} ${styles.inputGroup}`}>
        <label htmlFor="title">Title</label>
        <input
          value={blog.title}
          onChange={handleTitleChange}
          onBlur={validateTitle}
          type="text"
          id="title"
        />
        <p className={styles.error}>{titleError}</p>
      </div>
      <div className={styles.row}>
        <div className={`${styles.textInputGroup} ${styles.inputGroup}`}>
          <label htmlFor="class">Class</label>
          <input
            value={blog.class}
            onChange={handleClassChange}
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
      <BlogCover blog={blog} setBlog={setBlog} />
      <Tiptap editor={editor} />
    </form>
  );
}
