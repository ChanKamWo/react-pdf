export default function charIsAlphabetic(c) {
  return (
    (c.charCodeAt(0) >= 'a'.charCodeAt(0) &&
      c.charCodeAt(0) <= 'z'.charCodeAt(0)) ||
    (c.charCodeAt(0) >= 'A'.charCodeAt(0) &&
      c.charCodeAt(0) <= 'Z'.charCodeAt(0))
  );
}
