import React from "react";
import styles from "./Icon.module.css";

export default function CheckmarkIcon({
  className = "",
  ...props
}: React.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.icon} ${className}`}
      {...props}
    >
      <path
        d="M4 17L9 22L21 10M16 20L18 22L30 10"
        stroke="#D4D4D4"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
