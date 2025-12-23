import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Composable for managing control panel functionality
 */
export function useControlPanel() {
  const store = useStore()

  const hasHorses = computed(() => store.state.horses.length > 0)
  const isRacing = computed(() => store.state.isRacing)
  const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated)
  const canStartRaces = computed(() => store.getters.canStartRaces)

  const handleGenerateSchedule = async () => {
    try {
      if (!hasHorses.value) {
        throw new Error('Horses must be generated before creating race schedule')
      }

      await store.dispatch('generateRaceSchedule')
      console.log('Race schedule generated successfully')
    } catch (error) {
      console.error('Error generating race schedule:', error)

      let errorMessage = 'Error generating race schedule.'
      if (error.message.includes('Horses must be generated')) {
        errorMessage = 'Please wait for horses to be generated first.'
      } else if (error.message.includes('already exists')) {
        errorMessage = 'Race schedule already exists. Please start races or reset.'
      } else {
        errorMessage = 'An unexpected error occurred while generating the race schedule.'
      }

      alert(errorMessage)
    }
  }

  const handleStartRaces = async () => {
    try {
      if (!isScheduleGenerated.value) {
        throw new Error('Race schedule must be generated before starting races')
      }

      if (isRacing.value) {
        throw new Error('Races are already in progress')
      }

      await store.dispatch('startRaces')
      console.log('Races started successfully')
    } catch (error) {
      console.error('Error starting races:', error)

      let errorMessage = 'Error starting races.'
      if (error.message.includes('Race schedule must be generated')) {
        errorMessage = 'Please generate a race schedule first.'
      } else if (error.message.includes('already in progress')) {
        errorMessage = 'Races are already running. Please wait for completion.'
      } else {
        errorMessage = 'An unexpected error occurred while starting races.'
      }

      alert(errorMessage)
    }
  }

  return {
    hasHorses,
    isRacing,
    isScheduleGenerated,
    canStartRaces,
    handleGenerateSchedule,
    handleStartRaces
  }
}