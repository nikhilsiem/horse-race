import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Composable for managing race track functionality
 */
export function useRaceTrack() {
  const store = useStore()

  const currentRace = computed(() => {
    try {
      return store.getters.currentRaceData
    } catch (error) {
      console.error('Error getting current race data:', error)
      return null
    }
  })

  const isRacing = computed(() => {
    try {
      return store.state.isRacing || false
    } catch (error) {
      console.error('Error getting racing state:', error)
      return false
    }
  })

  const horsePositions = computed(() => {
    try {
      return store.state.horsePositions || {}
    } catch (error) {
      console.error('Error getting horse positions:', error)
      return {}
    }
  })

  const getHorsePosition = (horse) => {
    try {
      if (!horse || !horse.id) {
        console.warn('Invalid horse provided to getHorsePosition:', horse)
        return 0
      }

      const position = horsePositions.value[horse.id]
      
      // Debug logging
      if (currentRace.value && !isRacing.value) {
        console.log(`Horse ${horse.name} (ID: ${horse.id}) position: ${position}`)
      }

      if (position !== undefined && typeof position === 'number') {
        return Math.max(0, Math.min(position, 100))
      }

      if (currentRace.value && currentRace.value.completed) {
        return 100
      }

      return 0
    } catch (error) {
      console.error('Error calculating horse position:', error)
      return 0
    }
  }

  return {
    currentRace,
    isRacing,
    horsePositions,
    getHorsePosition
  }
}