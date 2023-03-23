"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Dropdown.module.css";
import chevronDown from "./chevron-down.svg";
import chevronUp from "./chevron-up.svg";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type DropdownProps = {
  items: string[];
  activeItem?: string;
  onSelectItem: (item: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

type Item = {
  name: string;
  selected: boolean;
};

export const Dropdown = ({
  items: itemStrings,
  activeItem = "",
  onSelectItem,
  className,
  ...props
}: DropdownProps) => {
  const [items, setItems] = useState<Item[]>([
    { name: "Select", selected: true },
  ]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setItems(
      itemStrings.map((item, i) => ({
        name: item,
        selected: i === 0,
      }))
    );
  }, [itemStrings.length]);

  useEffect(() => {
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        selected: item.name === activeItem,
      }))
    );
  }, [activeItem]);

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
    onSelectItem(selectedItem.innerText);
    setExpanded(false);
  };

  const dropdownMenu = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setExpanded(false);
  }, []);

  useOnClickOutside(dropdownMenu, close);

  return (
    <div className={`${styles.container} ${className}`} {...props}>
      <button
        type="button"
        className={styles.clickable}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <p>{selectedItem?.name}</p>
        <Image
          className={styles.chevron}
          src={expanded ? chevronUp : chevronDown}
          alt="chevron"
        />
      </button>
      {expanded && (
        <ul ref={dropdownMenu} className={styles.menu}>
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
