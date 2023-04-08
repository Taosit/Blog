import React from "react";
import Image from "next/image";
import styles from "./IconButton.module.css";

type IconButtonProps = {
  onClick: () => void;
  icon: string;
  alt: string;
};

export default function IconButton({ onClick, icon, alt }: IconButtonProps) {
  return (
    <button onClick={onClick} className={styles.iconButton}>
      <Image src={icon} alt={alt} width={24} height={24} />
    </button>
  );
}
