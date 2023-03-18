import { formatClass, getCourseError } from "@/lib/helpers";
import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import styles from "./CoursesInput.module.css";

type CoursesInputProps = {
  value: string[];
  label?: string;
  disabled?: boolean;
  setCourses: (tags: string[]) => void;
  validate?: (courses: string[]) => string;
  classNames?: { tag?: string; input?: string };
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function CoursesInput({
  value,
  label = "Courses",
  disabled = false,
  setCourses,
  validate = undefined,
  classNames,
}: CoursesInputProps) {
  const [error, setError] = useState("");

  const updateList = (courses: string[]) => {
    const newCourses = courses.filter(
      (course) => getCourseError(course) === ""
    );
    const dedupedCourses = [...new Set(newCourses)];
    const formattedCourses = dedupedCourses.map((course) =>
      formatClass(course).toUpperCase()
    );
    setCourses(formattedCourses);
    if (validate) {
      setError(validate(courses));
    }
  };

  const handleBlur = () => {
    if (validate) {
      setError(validate(value));
    }
  };

  return (
    <div onBlur={handleBlur}>
      <label className={styles.courseLable}>{label}</label>
      <TagsInput
        value={value}
        onChange={updateList}
        disabled={disabled}
        classNames={{ tag: styles.tag, input: styles.tagsInput, ...classNames }}
      />
      {validate && <p className={styles.error}>{error}</p>}
    </div>
  );
}
