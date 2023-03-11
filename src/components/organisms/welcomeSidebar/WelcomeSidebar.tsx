import { courses } from "@/seeds/courses";
import { link } from "fs";
import React from "react";
import styles from "./WelcomeSidebar.module.css";

export const WelcomeSidebar = () => {
  const websiteName = "[Name]";
  return (
    <aside className={styles.container}>
      <div className={styles.contentContainer}>
        <h2>Welcome to {websiteName}! </h2>
        <p>
          {websiteName} is a platform for UBC students to share articles and get
          comments & reviews from their classmates and professors
        </p>
        <h3>Courses currently using {websiteName}:</h3>
        <ul>
          {courses.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
