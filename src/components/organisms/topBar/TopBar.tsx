import React from "react";
import { Nav } from "../nav/Nav";
import { Search } from "../search/Search";
import styles from "./TopBar.module.css";

export const TopBar = () => {
  return (
    <div className={styles.container}>
      <Nav />
      <Search />
    </div>
  );
};
