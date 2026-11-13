export type RGB = [number, number, number]

/** Reads a CSS custom property from :root (e.g. "--shader-gold-light"). */
export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  if (Number.isNaN(n)) return [0, 0, 0]
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Token color as a 0..1 vec3 for shader uniforms, so WebGL follows tokens.css. */
export const tokenVec3 = (name: string): RGB => hexToRgb(cssVar(name)).map((c) => c / 255) as RGB
