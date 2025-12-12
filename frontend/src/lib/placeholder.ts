/**
 * Generate a placeholder image data URI
 * This avoids external DNS lookups during SSR
 * Uses URL-encoded SVG for better browser compatibility
 */
export function getPlaceholderImage(
  width: number = 400,
  height: number = 500,
  text: string = 'No Image'
): string {
  // Use a simple SVG data URI as placeholder (URL encoded for browser compatibility)
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">${text}</text></svg>`

  // URL encode the SVG for data URI (works in both Node.js and browser)
  if (typeof window === 'undefined') {
    // Server-side: use Buffer if available, otherwise encodeURIComponent
    try {
      const { Buffer } = require('buffer')
      return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
    } catch {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }
  }
  // Client-side: use encodeURIComponent
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

// Pre-generated placeholders for common sizes
export const PLACEHOLDER_IMAGES = {
  product: getPlaceholderImage(400, 500, 'No Image'),
  productLarge: getPlaceholderImage(600, 800, 'No Image'),
  thumbnail: getPlaceholderImage(100, 100, 'No Image'),
}
