"use client";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { toColorString } from "@/lib/helpers";
import { HslColorType } from "@/types/main";
import React, { useCallback, useRef, useState } from "react";
import { HslColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

type ColorPickerProps = {
  color: HslColorType;
  onChange: (newColor: HslColorType) => void;
  onSetColor?: () => void;
  className?: string;
};

export default function ColorPicker({
  color,
  onChange,
  onSetColor,
  className,
}: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const popover = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setShowColorPicker(false);
    if (onSetColor) {
      onSetColor();
    }
  }, [onSetColor]);

  useOnClickOutside(popover, close);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={`${styles.button} ${className}}`}
        onClick={() => setShowColorPicker((prev) => !prev)}
        style={{ backgroundColor: toColorString(color) }}
      ></button>
      {showColorPicker && (
        <div className="popover" ref={popover}>
          <HslColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
