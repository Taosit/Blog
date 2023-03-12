"use client";

import React from "react";
import styles from "./Filters.module.css";
import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { courses } from "@/seeds/courses";
import { terms } from "@/seeds/terms";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Filters = () => {
  const sortItems = ["Popular", "New"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const setSearchParams = (obj: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    Object.keys(obj).forEach((key) => {
      params.set(key, obj[key].toLowerCase());
    });
    router.replace(`${pathname}?${params}`);
  };

  return (
    <div className={styles.container}>
      <Dropdown
        className={styles.sortDropdown}
        items={sortItems}
        onSelectItem={(str) => setSearchParams({ sort: str })}
      />
      <Dropdown
        className={styles.coursesDropdown}
        items={["All Courses", ...courses]}
        onSelectItem={(str) => setSearchParams({ course: str })}
      />
      <Dropdown
        className={styles.termsDropdown}
        items={["All Terms", ...terms]}
        onSelectItem={(str) => setSearchParams({ term: str })}
      />
    </div>
  );
};