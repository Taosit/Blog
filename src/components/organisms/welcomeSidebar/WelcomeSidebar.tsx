import { getCoursesAndSemesters } from "@/lib/dbActions";
import React, { Suspense } from "react";
import styles from "./WelcomeSidebar.module.css";

export const WelcomeSidebar = () => {
  const websiteName = "[Name]";
  return (
    <aside className={styles.container}>
      <div className={styles.contentContainer}>
        <h2>Welcome to {websiteName} </h2>
        <p>
          {websiteName} is a platform for UBC students to share articles and get
          comments & reviews from their classmates and professors
        </p>
        <h3>Courses currently using {websiteName}:</h3>
        <Suspense fallback={<div>Loading...</div>}>
          {/* @ts-expect-error Server Component */}
          <Courses />
        </Suspense>
      </div>
    </aside>
  );
};

async function Courses() {
  const { courses } = await getCoursesAndSemesters();

  return (
    <ul>
      {courses.map((course: string) => (
        <li key={course}>{course.toUpperCase()}</li>
      ))}
    </ul>
  );
}
