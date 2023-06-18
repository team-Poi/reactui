import styles from "../../styles/components/loading.module.css";
import classNames from "../../utils/classNames";
import cssVarableStyle from "../../utils/cssVarableStyle";
import getSizeCSS, { Size } from "../../utils/size";

import React from "react";

export default function Loading(
  props: React.HTMLProps<HTMLDivElement> & { size?: Size }
) {
  return (
    <div
      {...props}
      className={styles.main}
      style={cssVarableStyle({
        "--size": getSizeCSS(props.size || "3rem"),
      })}
    >
      <i className={classNames(styles.loaders, styles.loader1)}></i>
      <i className={classNames(styles.loaders, styles.loader2)}></i>
      <i className={classNames(styles.loaders, styles.loader3)}></i>
    </div>
  );
}
