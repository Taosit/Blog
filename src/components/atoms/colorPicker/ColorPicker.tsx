"use client";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { toColorString } from "@/lib/helpers";
import { HslColorType } from "@/types/types";
import React, { useCallback, useRef, useState } from "react";
import { HslColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

type ColorPickerProps = {
  color: HslColorType;
  onChange: (newColor: HslColorType) => void;
  onSetColor: () => Promise<void>;
};

export default function ColorPicker({
  color,
  onChange,
  onSetColor,
}: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const popover = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setShowColorPicker(false);
    onSetColor();
  }, [onSetColor]);

  useOnClickOutside(popover, close);

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
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
