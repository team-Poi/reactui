import styles from "../styles/components/column.module.css";
import React from "react";

export default function FullFlex(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={[styles.column, props.className].join(" ")}
      style={{ flexGrow: 1, ...props.style }}
    >
      {props.children}
    </div>
  );
}
