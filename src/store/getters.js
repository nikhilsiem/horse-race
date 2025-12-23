/**
 * Vuex Store Getters
 * Computed state properties for the horse racing game
 */

export default {
  // Race management getters
  currentRaceData(state) {
    if (state.raceSchedule.length > 0 && state.currentRound < state.raceSchedule.length) {
      return state.raceSchedule[state.currentRound]
    }
    return null
  },

  isScheduleGenerated(state) {
    return state.raceGenerated && state.raceSchedule.length > 0
  },

  canStartRaces(state) {
    return state.raceGenerated && !state.isRacing && state.horses.length > 0
  },

  completedRounds(state) {
    return state.raceResults.length
  },

  // Results management getters
  getAllResults(state) {
    return state.raceResults
  },

  getResultByRound: (state) => (roundNumber) => {
    return state.raceResults.find(result => result.roundNumber === roundNumber)
  },

  getLatestResult(state) {
    if (state.raceResults.length === 0) return null
    return state.raceResults[state.raceResults.length - 1]
  },

  getResultsForRounds: (state) => (roundNumbers) => {
    return state.raceResults.filter(result => roundNumbers.includes(result.roundNumber))
  },

  hasHistoricalResults(state) {
    return state.raceResults.length > 0
  }
}