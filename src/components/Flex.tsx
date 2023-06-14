import React from "react";

export default function Flex(
  props: React.HTMLProps<HTMLDivElement> & { flex?: number }
) {
  return (
    <div
      {...props}
      style={{
        flex: props.flex || 1,
        ...props.style,
      }}
    >
      {props.children}
    </div>
  );
}
