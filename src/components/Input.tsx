import React, { HTMLInputTypeAttribute, useState } from "react";
import optCSS from "../utils/onoffCSS";
import styles from "../styles/components/input.module.css";
import classNames from "../utils/classNames";
import cssVarableStyle from "../utils/cssVarableStyle";
import Color from "../types/colors";
import Icon from "./Icon";

import fonts from "../styles/font.module.css";
import getColorVarable from "../utils/getColorVarable";

export type InputProps = React.HTMLProps<HTMLInputElement> & {
  color?: Color;
  icon?: string;
  css: React.CSSProperties;
};

function TextInput(props: InputProps) {
  const [isFocused, setFocused] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();
  const [val, setVal] = useState("");
  const [showHide, setShowHide] = useState(false);

  const ShowHideIcon = (props: { showHide: boolean; iconName: string }) => {
    return (
      <Icon
        icon={props.iconName}
        animated
        style={{
          opacity: props.showHide ? 0 : 1,
        }}
        onClick={() => setShowHide((j) => !j)}
        className={optCSS(props.showHide, styles.notEnabled)}
      />
    );
  };

  return (
    <div className={styles.superContainer} style={props.css}>
      {props.icon ? (
        <div className={styles.lsideThing}>
          <Icon icon={props.icon} />
        </div>
      ) : null}
      <div
        style={cssVarableStyle(
          {
            "--color": getColorVarable("PRIMARY", props.color),
          },
          {
            paddingTop:
              props.placeholder && (isFocused || val.length > 0)
                ? "19px"
                : "5px",
          }
        )}
        className={classNames(fonts.normal, styles.container)}
      >
        {/* {props.type == "password" ? (
          <label className={classNames(styles.showHide)}>
            <ShowHideIcon iconName="visibility" showHide={showHide} />
            <ShowHideIcon iconName="visibility_off" showHide={!showHide} />
          </label>
        ) : null} */}
        <label
          className={classNames(
            styles.label,
            optCSS(
              isFocused || (props.value || val).toString().length > 0,
              styles.ifclabel
            )
          )}
          style={{
            translate:
              isFocused || (props.value || val).toString().length > 0
                ? "transformY(-100%)"
                : `translateY(calc(${
                    inputRef.current?.clientHeight
                      ? (inputRef.current?.clientHeight / 2).toString() + "px"
                      : "0.5em"
                  } - 50%))`,
          }}
        >
          {props.placeholder}
        </label>
        <input
          {...props}
          placeholder=""
          ref={inputRef}
          type={
            props.type == "password"
              ? showHide
                ? "text"
                : "password"
              : props.type
          }
          value={props.value || val}
          className={classNames(
            styles.ipt,
            optCSS(isFocused, styles.focusedInput)
          )}
          onFocus={(e) => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          onChange={(e) => {
            setVal(e.target.value);
            props.onChange && props.onChange(e);
          }}
        />
      </div>
    </div>
  );
}

function FileInput(props: React.HTMLProps<HTMLInputElement>) {
  return (
    <div>
      <input type="file" />
    </div>
  );
}

export default function Input(props: InputProps) {
  let inputType = props.type as HTMLInputTypeAttribute | undefined;

  if (inputType === "password") return <TextInput {...props} />;
  else if (inputType === "text") return <TextInput {...props} />;
  else if (inputType === "url") return <TextInput {...props} />;
  else if (inputType === "file") return <FileInput {...props} />;
  else if (typeof inputType == "undefined")
    return <TextInput {...props} type="text" />;
  else return <input {...props} />;
}
