import styles from "../styles/components/progress.module.css";
import Color from "../types/colors";
import cssVarableStyle from "../utils/cssVarableStyle";
import getColorVarable from "../utils/getColorVarable";
import getSizeCSS, { Size } from "../utils/size";

import React from "react";

export default function Progress(props: {
  width?: Size;
  height?: Size;
  value?: Size;
  color?: Color;
}) {
  return (
    <>
      <div
        className={styles.bar}
        style={cssVarableStyle({
          "--width": getSizeCSS(props.width || "100px"),
          "--height": getSizeCSS(props.height || "15px"),
        })}
      >
        <div
          className={styles.movebar}
          style={cssVarableStyle({
            "--value": getSizeCSS(`${props.value}%` || "0%"),
            "--color": getColorVarable("PRIMARY", props.color),
          })}
        ></div>
      </div>
    </>
  );
}
