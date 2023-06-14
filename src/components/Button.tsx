import styles from "../styles/components/button.module.css";
import fonts from "../styles/font.module.css";
import Color from "../types/colors";
import classNames from "../utils/classNames";

import React, { useState } from "react";
import getColorVarable from "../utils/getColorVarable";
import Ripple from "./Ripple";

export default function Button(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: Color;
    bordered?: boolean;
    css?: React.CSSProperties;
  }
) {
  const getColorStyle: () => React.CSSProperties = () => {
    let color = getColorVarable("PRIMARY", props.color);
    if (!props.bordered)
      return {
        backgroundColor: color,
        color: "white",
      };
    else
      return {
        border: `2px solid ${color}`,
        background: "none",
        color: color,
      };
  };
  const getButtonProps = () => {
    let cpprop = { ...props };
    if (typeof cpprop.bordered !== "undefined")
      (cpprop.bordered as any) = cpprop.bordered.toString();
    return cpprop;
  };
  return (
    <Ripple
      style={{
        borderRadius: "8px",
        ...(props.css || {}),
      }}
    >
      <button
        {...getButtonProps()}
        style={Object.assign(getColorStyle(), props.style || {})}
        className={classNames(
          fonts.noraml,
          styles.buttons,
          props.className || ""
        )}
      />
    </Ripple>
  );
}
