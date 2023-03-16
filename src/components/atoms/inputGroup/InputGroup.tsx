"use client";

import React, { PropsWithChildren, useState } from "react";
import styles from "./InputGroup.module.css";

type InputGroupProps = {
  id?: string;
  type?: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  validate?: (str: string) => string;
} & React.HTMLAttributes<HTMLDivElement>;

export const InputGroup = ({
  id,
  type = "text",
  label,
  value,
  onChange,
  disabled = false,
  onKeyDown = (e) => {},
  validate = (str: string) => "",
  className,
}: InputGroupProps) => {
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setError("");
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(validate(e.target.value));
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <label htmlFor={id || label}>{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onBlur={handleBlur}
      />
      <p>{error}</p>
    </div>
  );
};
