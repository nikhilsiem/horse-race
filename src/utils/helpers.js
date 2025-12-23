/**
 * Utility helper functions
 */

/**
 * Generate unique colors for horses
 * @param {number} count - Number of colors to generate
 * @returns {string[]} Array of HSL color strings
 */
export function generateUniqueColors(count) {
  const colors = []
  const hueStep = 360 / count
  
  for (let i = 0; i < count; i++) {
    const hue = Math.floor(i * hueStep)
    const saturation = 70 + Math.random() * 30 // 70-100%
    const lightness = 40 + Math.random() * 20  // 40-60%
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    colors.push(color)
  }
  
  return colors
}

/**
 * Generate random condition score between 1-100
 * @returns {number} Random condition score
 */
export function generateConditionScore() {
  return Math.floor(Math.random() * 100) + 1
}

/**
 * Format timestamp to readable time
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time string
 */
export function formatTime(timestamp) {
  try {
    if (!timestamp) return 'Unknown time'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  } catch (error) {
    console.error('Error formatting time:', error)
    return 'Invalid time'
  }
}

/**
 * Shuffle array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} New shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}