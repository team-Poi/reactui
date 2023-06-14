import React from "react";

export default function cssVarableStyle(
  varables: { [key: string]: any } = {},
  style: React.CSSProperties = {}
) {
  return { ...style, ...varables } as React.CSSProperties;
}
