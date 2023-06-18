import styles from "../../styles/components/switch.module.css";
import Color from "../../types/colors";
import classNames from "../../utils/classNames";
import cssVarableStyle from "../../utils/cssVarableStyle";
import getColorVarable from "../../utils/getColorVarable";
import optCSS from "../../utils/onoffCSS";
import getSizeCSS, { Size } from "../../utils/size";

import React, { useState } from "react";

interface SwitchProp {
  value?: boolean;
  onChange?: (value: boolean) => void;
  style?: React.CSSProperties;
  color?: Color;
  height?: Size;
  width?: Size;
}
export default function Switch(props: SwitchProp) {
  let [enabled, setEnabled] = useState(props.value || false);
  const getVal = () => {
    return typeof props.value !== "undefined" ? props.value : enabled;
  };
  return (
    <>
      <div
        style={cssVarableStyle(
          {
            "--color": getColorVarable("PRIMARY", props.color),
            "--width": getSizeCSS(props.width || "3rem"),
            "--size": getSizeCSS(props.height || "1rem"),
          },
          props.style
        )}
        onClick={() => {
          (
            props.onChange ||
            ((val: boolean) => {
              setEnabled(val);
            })
          )(!getVal());
        }}
        className={classNames(
          styles.container,
          optCSS(!getVal(), styles.offBackground)
        )}
      >
        <div
          className={classNames(styles.dot, optCSS(getVal(), styles.enabled))}
        ></div>
      </div>
    </>
  );
}
