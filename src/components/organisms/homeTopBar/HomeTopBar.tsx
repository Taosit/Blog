import React from "react";
import { Nav } from "../nav/Nav";
import { Search } from "../search/Search";
import styles from "./HomeTopBar.module.css";

export const HomeTopBar = () => {
  return (
    <div className={styles.container}>
      <Nav />
      <Search />
    </div>
  );
};
