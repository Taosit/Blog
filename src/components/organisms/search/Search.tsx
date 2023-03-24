"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import styles from "./Search.module.css";

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState("");

  const search = () => {
    const params = new URLSearchParams(searchParams as URLSearchParams);
    params.set("search", searchValue);
    router.replace(`${pathname}?${params}`);
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
