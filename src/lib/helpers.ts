export function darkenColor(color: string) {
  const num = parseInt(color.substring(1), 16);
  const r = (num >> 16) - 50;
  const b = ((num >> 8) & 0x00ff) - 50;
  const g = (num & 0x0000ff) - 50;
  const newColor = g | (b << 8) | (r << 16);
  return `#${newColor.toString(16)}`;
}
