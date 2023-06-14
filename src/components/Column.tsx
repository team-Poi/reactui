import { CSSProperties, ReactNode } from "react";
import styles from "../styles/components/column.module.css";
import getSizeCSS, { Size } from "../utils/size";
import { Property } from "csstype";

import React from "react";

export default function Column(props: {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  gap?: Size;
}) {
  return (
    <div
      className={[styles.column, props.className].join(" ")}
      style={{
        rowGap: getSizeCSS(props.gap || 0),
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}

const Saero = Column;
export { Saero };
