import styles from "../styles/components/Icon.module.css";

import React from "react";
import classNames from "../utils/classNames";
import optCSS from "../utils/onoffCSS";

export default function Icon(
  props: React.HTMLProps<HTMLSpanElement> & {
    icon: string;
    animated?: boolean;
  }
) {
  return (
    <span
      {...(() => {
        let a = { ...props };
        if (typeof a.animated == "boolean") (a as any).animated = "boolean";
        return a;
      })()}
      className={classNames(
        props.className || "",
        styles.icn,
        optCSS(props.animated || false, styles.animated),
        "material-symbols-rounded"
      )}
      style={props.style}
    >
      {props.icon}
    </span>
  );
}
