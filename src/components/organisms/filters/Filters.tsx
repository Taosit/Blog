"use client";

import React from "react";
import styles from "./Filters.module.css";
import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { courses } from "@/seeds/courses";
import { terms } from "@/seeds/terms";

export const Filters = () => {
  const sortItems = ["Popular", "New"];
  return (
    <div className={styles.container}>
      <Dropdown
        className={styles.sort}
        items={sortItems}
        onSelectItem={() => console.log("sorting")}
      />
      <Dropdown
        items={courses}
        onSelectItem={() => console.log("filtering by courses")}
      />
      <Dropdown
        items={terms}
        onSelectItem={() => console.log("filtering by terms")}
      />
    </div>
  );
};
