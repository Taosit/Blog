"use client";

import { Button } from "@/components/atoms/button/Button";
import { BlogForm } from "@/components/organisms/blogForm/BlogForm";
import React from "react";
import styles from "./EditBlog.module.css";

const EditBlog = () => {
  const save = () => {};
  return (
    <div className={styles.container}>
      <button className={styles.topSaveButton} onClick={save}>
        Save
      </button>
      <BlogForm />
      <div className={styles.buttonContainer}>
        <button className={styles.discardButton}>Discard Changes</button>
        <Button className={styles.bottomSaveButton} onClick={save}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditBlog;
