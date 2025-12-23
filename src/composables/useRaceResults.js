import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Composable for managing race results
 */
export function useRaceResults() {
  const store = useStore()

  const raceResults = computed(() => {
    try {
      return store.getters.getAllResults || []
    } catch (error) {
      console.error('Error getting race results:', error)
      return []
    }
  })

  const hasResults = computed(() => {
    try {
      return store.getters.hasHistoricalResults
    } catch (error) {
      console.error('Error checking historical results:', error)
      return false
    }
  })

  const latestResult = computed(() => {
    try {
      return store.getters.getLatestResult
    } catch (error) {
      console.error('Error getting latest result:', error)
      return null
    }
  })

  const formatTime = (timestamp) => {
    try {
      if (!timestamp) return 'Unknown time'
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    } catch (error) {
      console.error('Error formatting time:', error)
      return 'Invalid time'
    }
  }

  return {
    raceResults,
    hasResults,
    latestResult,
    formatTime
  }
}