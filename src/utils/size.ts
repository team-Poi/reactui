export type Pixel = number;
export type CustomSize = string;
export type Size = Pixel | CustomSize;
export default function getSizeCSS(size: Size) {
  if (typeof size === "number") return `${size}px`;
  else return size;
}
