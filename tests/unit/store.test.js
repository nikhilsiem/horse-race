import { describe, it, expect } from 'vitest'
import store from '../../src/store/index.js'

describe('Vuex Store', () => {
  it('should have correct initial state', () => {
    const state = store.state
    
    expect(state.horses).toEqual([])
    expect(state.raceSchedule).toEqual([])
    expect(state.currentRound).toBe(0)
    expect(state.raceResults).toEqual([])
    expect(state.isRacing).toBe(false)
    expect(state.raceGenerated).toBe(false)
  })

  it('should have all required mutations', () => {
    const mutations = Object.keys(store._mutations)
    
    expect(mutations).toContain('SET_HORSES')
    expect(mutations).toContain('SET_RACE_SCHEDULE')
    expect(mutations).toContain('SET_CURRENT_ROUND')
    expect(mutations).toContain('ADD_RACE_RESULT')
    expect(mutations).toContain('SET_RACING_STATE')
    expect(mutations).toContain('SET_RACE_GENERATED')
  })

  it('should have all required actions', () => {
    const actions = Object.keys(store._actions)
    
    expect(actions).toContain('generateHorses')
    expect(actions).toContain('generateRaceSchedule')
    expect(actions).toContain('startRaces')
    expect(actions).toContain('runSingleRace')
    expect(actions).toContain('completeRace')
  })

  it('should have all required getters', () => {
    const getters = Object.keys(store.getters)
    
    expect(getters).toContain('currentRaceData')
    expect(getters).toContain('isScheduleGenerated')
    expect(getters).toContain('canStartRaces')
    expect(getters).toContain('completedRounds')
  })

  it('should generate horses correctly', async () => {
    // Dispatch the generateHorses action
    await store.dispatch('generateHorses')
    
    const horses = store.state.horses
    
    // Should generate exactly 20 horses
    expect(horses).toHaveLength(20)
    
    // Each horse should have required properties
    horses.forEach((horse, index) => {
      expect(horse).toHaveProperty('id')
      expect(horse).toHaveProperty('name')
      expect(horse).toHaveProperty('color')
      expect(horse).toHaveProperty('condition')
      expect(horse).toHaveProperty('position')
      
      // ID should be unique and sequential
      expect(horse.id).toBe(index + 1)
      
      // Condition should be between 1-100
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
      
      // Position should start at 0
      expect(horse.position).toBe(0)
      
      // Name should be a string
      expect(typeof horse.name).toBe('string')
      expect(horse.name.length).toBeGreaterThan(0)
      
      // Color should be a valid HSL string
      expect(horse.color).toMatch(/^hsl\(\d+, \d+(\.\d+)?%, \d+(\.\d+)?%\)$/)
    })
    
    // All horses should have unique IDs
    const ids = horses.map(h => h.id)
    const uniqueIds = [...new Set(ids)]
    expect(uniqueIds).toHaveLength(20)
    
    // All horses should have unique colors
    const colors = horses.map(h => h.color)
    const uniqueColors = [...new Set(colors)]
    expect(uniqueColors).toHaveLength(20)
    
    // All horses should have unique names
    const names = horses.map(h => h.name)
    const uniqueNames = [...new Set(names)]
    expect(uniqueNames).toHaveLength(20)
  })

  it('should generate race schedule correctly', async () => {
    // First generate horses
    await store.dispatch('generateHorses')
    
    // Then generate race schedule
    await store.dispatch('generateRaceSchedule')
    
    const schedule = store.state.raceSchedule
    
    // Should generate exactly 6 rounds
    expect(schedule).toHaveLength(6)
    
    // Check predetermined distances
    const expectedDistances = [1200, 1400, 1600, 1800, 2000, 2200]
    
    schedule.forEach((round, index) => {
      // Each round should have required properties
      expect(round).toHaveProperty('roundNumber')
      expect(round).toHaveProperty('distance')
      expect(round).toHaveProperty('participants')
      expect(round).toHaveProperty('completed')
      expect(round).toHaveProperty('results')
      
      // Round number should be sequential
      expect(round.roundNumber).toBe(index + 1)
      
      // Distance should match predetermined values
      expect(round.distance).toBe(expectedDistances[index])
      
      // Should have exactly 10 participants
      expect(round.participants).toHaveLength(10)
      
      // Should start as not completed
      expect(round.completed).toBe(false)
      
      // Results should start empty
      expect(round.results).toEqual([])
      
      // All participants should be valid horses
      round.participants.forEach(horse => {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('condition')
        expect(horse).toHaveProperty('position')
      })
      
      // All participants should have unique IDs within the round
      const participantIds = round.participants.map(h => h.id)
      const uniqueParticipantIds = [...new Set(participantIds)]
      expect(uniqueParticipantIds).toHaveLength(10)
    })
    
    // Race should be marked as generated
    expect(store.state.raceGenerated).toBe(true)
    
    // Current round should be reset to 0
    expect(store.state.currentRound).toBe(0)
  })

  it('should throw error when generating race schedule without horses', async () => {
    // Reset store state
    store.state.horses = []
    store.state.raceSchedule = []
    store.state.raceGenerated = false
    
    // Should throw error when trying to generate schedule without horses
    await expect(async () => {
      await store.dispatch('generateRaceSchedule')
    }).rejects.toThrow('Horses must be generated before creating race schedule')
  })
})