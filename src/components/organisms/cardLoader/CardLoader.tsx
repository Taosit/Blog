import React from "react";
import styles from "./CardLoader.module.css";

export function CardLoader() {
  return (
    <article className={styles.loadingCard}>
      <div className={styles.cardTop}>
        <h3 className={styles.title}></h3>
        <span className={styles.tagsContainer}>
          <span className={styles.tag}></span>
          <span className={styles.tag}></span>
        </span>
      </div>
      <div className={styles.cardBottom}></div>
    </article>
  );
}
