/**
 * Vuex Store Mutations
 * Synchronous state modifications for the horse racing game
 */

export default {
  // Horse management mutations
  SET_HORSES(state, horses) {
    state.horses = horses
  },

  // Race scheduling mutations
  SET_RACE_SCHEDULE(state, schedule) {
    state.raceSchedule = schedule
  },

  SET_CURRENT_ROUND(state, round) {
    state.currentRound = round
  },

  SET_RACING_STATE(state, isRacing) {
    state.isRacing = isRacing
  },

  SET_RACE_GENERATED(state, generated) {
    state.raceGenerated = generated
  },

  // Race execution mutations
  UPDATE_HORSE_POSITIONS(state, positions) {
    state.horsePositions = { ...state.horsePositions, ...positions }
  },

  RESET_HORSE_POSITIONS(state) {
    state.horsePositions = {}
  },

  // Results management mutations
  ADD_RACE_RESULT(state, result) {
    state.raceResults.push(result)
  },

  CLEAR_RACE_RESULTS(state) {
    state.raceResults = []
  },

  UPDATE_RACE_RESULT(state, { roundNumber, updatedResult }) {
    const index = state.raceResults.findIndex(result => result.roundNumber === roundNumber)
    if (index !== -1) {
      state.raceResults[index] = updatedResult
    }
  },

  REMOVE_RACE_RESULT(state, roundNumber) {
    state.raceResults = state.raceResults.filter(result => result.roundNumber !== roundNumber)
  }
}