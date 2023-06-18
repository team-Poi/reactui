import Color from "../../types/colors";

export default function getColorVarable(defaultColor: Color, color?: Color) {
  return `var(--POI-UI-${color || defaultColor})`;
}
