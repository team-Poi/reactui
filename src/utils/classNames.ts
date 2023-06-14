export default function classNames(...classnames: (string | null)[]) {
  return classnames.filter((j) => j && j.length > 0).join(" ");
}
