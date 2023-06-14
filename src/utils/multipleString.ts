export default function MultipleString(str: string, count: number, join = " ") {
  let out = [];
  while (out.length < count) out.push(str);
  return out.join(join);
}
