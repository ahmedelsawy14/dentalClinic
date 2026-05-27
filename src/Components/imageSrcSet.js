export function makeSrcSet(url, sizes = [400, 600, 900]) {
  if (!url || !url.includes("w=")) return "";
  return sizes
    .map((width) => `${url.replace(/w=\d+/, `w=${width}`)} ${width}w`)
    .join(", ");
}
