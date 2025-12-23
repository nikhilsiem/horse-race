import { describe, it, expect, beforeEach } from 'vitest'
import store from '../../src/store/index.js'

describe('Vuex Store Mutations', () => {
  beforeEach(() => {
    // Reset store state before each test
    store.commit('SET_HORSES', [])
    store.commit('SET_RACE_SCHEDULE', [])
    store.commit('SET_CURRENT_ROUND', 0)
    store.commit('SET_RACING_STATE', false)
    store.commit('SET_RACE_GENERATED', false)
    // Clear race results
    store.state.raceResults = []
  })

  it('SET_HORSES should update horses state', () => {
    const testHorses = [
      { id: 1, name: 'Thunder', color: '#FF0000', condition: 85 },
      { id: 2, name: 'Lightning', color: '#00FF00', condition: 92 }
    ]
    
    store.commit('SET_HORSES', testHorses)
    
    expect(store.state.horses).toEqual(testHorses)
  })

  it('SET_RACE_SCHEDULE should update race schedule', () => {
    const testSchedule = [
      { roundNumber: 1, distance: 1200, participants: [], completed: false },
      { roundNumber: 2, distance: 1400, participants: [], completed: false }
    ]
    
    store.commit('SET_RACE_SCHEDULE', testSchedule)
    
    expect(store.state.raceSchedule).toEqual(testSchedule)
  })

  it('SET_CURRENT_ROUND should update current round', () => {
    store.commit('SET_CURRENT_ROUND', 3)
    
    expect(store.state.currentRound).toBe(3)
  })

  it('ADD_RACE_RESULT should add result to results array', () => {
    const testResult = {
      roundNumber: 1,
      distance: 1200,
      rankings: [
        { position: 1, horse: { id: 1, name: 'Thunder' }, finishTime: 120 }
      ]
    }
    
    store.commit('ADD_RACE_RESULT', testResult)
    
    expect(store.state.raceResults).toHaveLength(1)
    expect(store.state.raceResults[0]).toEqual(testResult)
  })

  it('SET_RACING_STATE should update racing state', () => {
    store.commit('SET_RACING_STATE', true)
    expect(store.state.isRacing).toBe(true)
    
    store.commit('SET_RACING_STATE', false)
    expect(store.state.isRacing).toBe(false)
  })

  it('SET_RACE_GENERATED should update race generated state', () => {
    store.commit('SET_RACE_GENERATED', true)
    expect(store.state.raceGenerated).toBe(true)
    
    store.commit('SET_RACE_GENERATED', false)
    expect(store.state.raceGenerated).toBe(false)
  })
})