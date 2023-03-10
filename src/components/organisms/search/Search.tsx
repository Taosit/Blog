"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import styles from "./Search.module.css";

export const Search = () => {
  const { push } = useRouter();

  const [searchValue, setSearchValue] = useState("");

  const search = () => {
    if (!searchValue) return;
    push(`/blogs?search=${searchValue}`);
  };

  return (
    <input
      className={styles.input}
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      onKeyDown={(e) => e.code === "Enter" && search()}
      type="text"
      placeholder="Search for articles or authors"
    />
  );
};
