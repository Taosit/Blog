import { savedPostType } from "@/types/types";
import React from "react";
import styles from "./BlogForm.module.css";

export function BlogForm({ blog }: { blog: savedPostType }) {
  return <form className={styles.form}>blogForm</form>;
}
