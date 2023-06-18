import React, { useState } from "react";
import styles from "../../styles/components/ripple.module.css";
import classNames from "../../utils/classNames";

export default function Ripple(
  props: React.HTMLProps<HTMLDivElement> & {
    during?: string;
    color?: string;
  } = {
    during: "600ms",
  }
) {
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties>({
    position: "absolute",
    borderRadius: "50%",
    opacity: 0,
    width: 35,
    height: 35,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  });

  const onClick = (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.stopPropagation();
    const { pageX, pageY, currentTarget } = ev;

    const rect = currentTarget.getBoundingClientRect();

    const left = pageX - (rect.left + window.scrollX);
    const top = pageY - (rect.top + window.scrollY);
    const size = Math.max(rect.width, rect.height);

    setRippleStyle((stylex) => {
      return {
        ...stylex,
        left,
        top,
        opacity: 1,
        transform: "translate(-50%, -50%)",
        transition: "initial",
        backgroundColor: props.color || `rgba(0, 0, 0, 0.3)`,
      };
    });
    setTimeout(() => {
      setRippleStyle((stylex) => {
        return {
          ...stylex,
          opacity: 0,
          transform: `scale(${size / 9})`,
          transition: `all ${props.during || "600ms"}`,
          left,
          top,
        };
      });
    }, 50);
  };

  return (
    <>
      <div
        {...props}
        className={classNames(styles.container, props.className || "")}
        onMouseUp={(e) => {
          props.onMouseUp && props.onMouseUp(e);
          onClick(e);
        }}
      >
        {props.children}
        <s style={rippleStyle} />
      </div>
    </>
  );
}
