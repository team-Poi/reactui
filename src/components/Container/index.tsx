import React from "react";
import styles from "../../styles/components/container.module.css";
import classNames from "../../utils/classNames";

export default function Conatiner(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={classNames(styles.container, props.className || "")}
    >
      {props.children}
    </div>
  );
}
