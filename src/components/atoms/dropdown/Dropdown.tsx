"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./Dropdown.module.css";
import chevronDown from "./chevron-down.svg";
import chevronUp from "./chevron-up.svg";

type DropdownProps = {
  items: string[];
  onSelectItem: (item: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Dropdown = ({
  items: itemStrings,
  onSelectItem,
  ...props
}: DropdownProps) => {
  const initialItmes = itemStrings.map((item, i) => ({
    name: item,
    selected: i === 0,
  }));
  const [items, setItems] = useState(initialItmes);
  const [expanded, setExpanded] = useState(false);

  const selectedItem = items.find((item) => item.selected);
  const otherItems = items.filter((item) => !item.selected);

  const selectItem = (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ) => {
    const selectedItem = e.target as HTMLLIElement;
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: item.name === selectedItem.innerText,
      }))
    );
    setExpanded(false);
    onSelectItem(selectedItem.innerText);
  };

  return (
    <div className={styles.container} {...props}>
      <button
        className={styles.clickable}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p>{selectedItem?.name}</p>
        <Image src={expanded ? chevronUp : chevronDown} alt="chevron" />
      </button>
      {expanded && (
        <ul className={styles.menu}>
          {otherItems.map((item) => (
            <li
              tabIndex={0}
              key={item.name}
              className={styles.menuItem}
              onClick={selectItem}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  selectItem(e);
                }
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
