import { formatClass } from "@/lib/helpers";
import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component";
import styles from "./TagsInputGroup.module.css";

type TagsInputGroupProps = {
  value: string[];
  label?: string;
  disabled?: boolean;
  setTags: (tags: string[]) => void;
  validateEach?: (course: string) => boolean;
  formatEach?: (course: string) => string;
  validateAll?: (courses: string[]) => string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TagsInputGroup({
  value,
  label = "Courses",
  disabled = false,
  setTags,
  validateEach = undefined,
  formatEach = undefined,
  validateAll = undefined,
  className = "",
}: TagsInputGroupProps) {
  const [error, setError] = useState("");

  const updateList = (courses: string[]) => {
    let newCourses = courses;
    if (validateEach) {
      newCourses = courses.filter((course) => validateEach(course));
    }
    let formattedCourses = [...new Set(newCourses)];
    if (formatEach) {
      formattedCourses = formattedCourses.map((course) => formatEach(course));
    }
    setTags(formattedCourses);
    if (validateAll) {
      setError(validateAll(courses));
    }
  };

  const handleBlur = () => {
    if (validateAll) {
      setError(validateAll(value));
    }
  };

  return (
    <div onBlur={handleBlur} className={className}>
      <label className={styles.courseLable}>{label}</label>
      <TagsInput
        value={value}
        onChange={updateList}
        disabled={disabled}
        classNames={{ tag: styles.tag, input: styles.tagsInput }}
      />
      {validateAll && <p className={styles.error}>{error}</p>}
    </div>
  );
}
