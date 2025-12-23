import { describe, it, expect, beforeEach } from 'vitest'
import store from '../../src/store/index.js'

describe('Vuex Store Getters', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.commit('SET_HORSES', [])
    store.commit('SET_RACE_SCHEDULE', [])
    store.commit('SET_CURRENT_ROUND', 0)
    store.commit('SET_RACING_STATE', false)
    store.commit('SET_RACE_GENERATED', false)
    store.state.raceResults = []
  })

  describe('currentRaceData', () => {
    it('should return null when no race schedule exists', () => {
      expect(store.getters.currentRaceData).toBeNull()
    })

    it('should return current round data when schedule exists', () => {
      const testSchedule = [
        { roundNumber: 1, distance: 1200, participants: [] },
        { roundNumber: 2, distance: 1400, participants: [] }
      ]
      
      store.commit('SET_RACE_SCHEDULE', testSchedule)
      store.commit('SET_CURRENT_ROUND', 0)
      
      expect(store.getters.currentRaceData).toEqual(testSchedule[0])
    })

    it('should return null when current round exceeds schedule length', () => {
      const testSchedule = [
        { roundNumber: 1, distance: 1200, participants: [] }
      ]
      
      store.commit('SET_RACE_SCHEDULE', testSchedule)
      store.commit('SET_CURRENT_ROUND', 1)
      
      expect(store.getters.currentRaceData).toBeNull()
    })
  })

  describe('isScheduleGenerated', () => {
    it('should return false when race not generated', () => {
      expect(store.getters.isScheduleGenerated).toBe(false)
    })

    it('should return false when race generated but no schedule', () => {
      store.commit('SET_RACE_GENERATED', true)
      expect(store.getters.isScheduleGenerated).toBe(false)
    })

    it('should return true when race generated and schedule exists', () => {
      store.commit('SET_RACE_GENERATED', true)
      store.commit('SET_RACE_SCHEDULE', [{ roundNumber: 1, distance: 1200 }])
      expect(store.getters.isScheduleGenerated).toBe(true)
    })
  })

  describe('canStartRaces', () => {
    it('should return false when race not generated', () => {
      expect(store.getters.canStartRaces).toBe(false)
    })

    it('should return false when racing is active', () => {
      store.commit('SET_RACE_GENERATED', true)
      store.commit('SET_HORSES', [{ id: 1, name: 'Test' }])
      store.commit('SET_RACING_STATE', true)
      expect(store.getters.canStartRaces).toBe(false)
    })

    it('should return false when no horses exist', () => {
      store.commit('SET_RACE_GENERATED', true)
      store.commit('SET_RACING_STATE', false)
      expect(store.getters.canStartRaces).toBe(false)
    })

    it('should return true when all conditions are met', () => {
      store.commit('SET_RACE_GENERATED', true)
      store.commit('SET_RACING_STATE', false)
      store.commit('SET_HORSES', [{ id: 1, name: 'Test' }])
      expect(store.getters.canStartRaces).toBe(true)
    })
  })

  describe('completedRounds', () => {
    it('should return 0 when no results exist', () => {
      expect(store.getters.completedRounds).toBe(0)
    })

    it('should return correct count of completed rounds', () => {
      const testResults = [
        { roundNumber: 1, rankings: [] },
        { roundNumber: 2, rankings: [] }
      ]
      
      store.commit('ADD_RACE_RESULT', testResults[0])
      store.commit('ADD_RACE_RESULT', testResults[1])
      
      expect(store.getters.completedRounds).toBe(2)
    })
  })
})