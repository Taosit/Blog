"use client";

import React, { useEffect, useState } from "react";
import styles from "./Filters.module.css";
import { Dropdown } from "@/components/atoms/dropdown/Dropdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Filters = ({ getFilters }: { getFilters: Promise<any> }) => {
  const sortItems = ["Popular", "New"];
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [courses, setCourses] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    getFilters.then((res) => {
      setCourses(res.courses);
      setTerms(res.semesters);
    });
  }, [getFilters]);

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
