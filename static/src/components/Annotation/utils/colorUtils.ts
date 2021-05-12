export const hex2rgba = (hex: string, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const createBackground = (colors: string[]) => {
  const sectionLength = Math.floor(100 / colors.length)
  const sectionStrings = colors.map((c, i) => {
    const start = i == 0 ? 0 : i * sectionLength + 5
    const end = i == colors.length - 1 ? 100 : (i + 1) * sectionLength - 5
    return `${c} ${start}%,${c} ${end}%`
  })
  return `linear-gradient(to right, ${sectionStrings.join(',')})`
}
