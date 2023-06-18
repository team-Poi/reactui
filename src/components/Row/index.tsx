import { CSSProperties, ReactNode } from "react";
import styles from "../../styles/components/row.module.css";
import getSizeCSS, { Size } from "../../utils/size";

import React from "react";

export default function Row(props: {
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
  gap?: Size;
}) {
  return (
    <div
      className={[styles.row, props.className].join(" ")}
      style={{
        ...props.style,
        columnGap: getSizeCSS(props.gap || 0),
      }}
    >
      {props.children}
    </div>
  );
}

const Garo = Row;

export { Garo };
