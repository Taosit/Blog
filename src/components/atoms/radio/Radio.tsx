"use client";

import React, { useState } from "react";
import styles from "./Radio.module.css";

type RadioProps = {
  items: [string, string];
  onSelectItem: (item: string) => void;
  hasDefault?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Radio = ({
  items,
  onSelectItem,
  hasDefault = false,
  className,
  ...props
}: RadioProps) => {
  const [selectedItem, setSelectedItem] = useState(hasDefault ? 0 : null);

  const selectItem = (i: number) => {
    if (i === selectedItem) return;
    setSelectedItem(i);
    onSelectItem(items[i]);
  };

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <button
        type="button"
        className={selectedItem === 0 ? styles.active : ""}
        onClick={() => selectItem(0)}
      >
        {items[0]}
      </button>
      <button
        type="button"
        className={selectedItem === 1 ? styles.active : ""}
        onClick={() => selectItem(1)}
      >
        {items[1]}
      </button>
    </div>
  );
};
