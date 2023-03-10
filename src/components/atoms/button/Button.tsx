import React, { PropsWithChildren } from "react";
import styles from "./Button.module.css";

export type ButtonProps = {
  size?: "small" | "large";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  size = "small",
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <button
      {...props}
      className={`${styles.button} ${size === "large" ? styles.large : ""}`}
    >
      {children}
    </button>
  );
};
