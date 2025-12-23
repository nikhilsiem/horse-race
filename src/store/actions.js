/**
 * Vuex Store Actions
 * Asynchronous operations and business logic for the horse racing game
 */

import { HORSE_NAMES, RACE_DISTANCES, RACE_CONFIG } from '../utils/constants.js'
import { generateUniqueColors, generateConditionScore } from '../utils/helpers.js'

/**
 * Create a single horse with unique properties
 * @param {number} id - Horse ID
 * @param {string} name - Horse name
 * @param {string} color - Horse color
 * @returns {Object} Horse object
 */
function createHorse(id, name, color) {
  return {
    id,
    name,
    color,
    condition: generateConditionScore(),
    position: 0
  }
}

/**
 * Factory function to create exactly 20 horses
 * @returns {Array} Array of horse objects
 */
function createHorses() {
  const horses = []
  const colors = generateUniqueColors(RACE_CONFIG.TOTAL_HORSES)
  
  for (let i = 0; i < RACE_CONFIG.TOTAL_HORSES; i++) {
    const horse = createHorse(
      i + 1, // Unique ID starting from 1
      HORSE_NAMES[i], // Each horse gets a unique name
      colors[i] // Each horse gets a unique color
    )
    horses.push(horse)
  }
  
  return horses
}

export default {
  // Horse management actions
  generateHorses({ commit, state }) {
    try {
      // Check if horses already exist
      if (state.horses.length > 0) {
        console.warn('Horses already generated, skipping generation')
        return
      }
      
      const horses = createHorses()
      
      // Validate generated horses
      if (!horses || horses.length !== RACE_CONFIG.TOTAL_HORSES) {
        throw new Error(`Failed to generate exactly ${RACE_CONFIG.TOTAL_HORSES} horses`)
      }
      
      // Validate each horse has required properties
      horses.forEach((horse, index) => {
        if (!horse.id || !horse.name || !horse.color || typeof horse.condition !== 'number') {
          throw new Error(`Invalid horse data at index ${index}`)
        }
        if (horse.condition < 1 || horse.condition > 100) {
          throw new Error(`Invalid condition score for horse ${horse.name}: ${horse.condition}`)
        }
      })
      
      commit('SET_HORSES', horses)
      console.log(`Successfully generated ${RACE_CONFIG.TOTAL_HORSES} horses`)
    } catch (error) {
      console.error('Error in generateHorses action:', error)
      throw error // Re-throw to allow component to handle
    }
  },

  // Race scheduling actions
  generateRaceSchedule({ commit, state }) {
    try {
      // Ensure horses are generated first
      if (state.horses.length === 0) {
        throw new Error('Horses must be generated before creating race schedule')
      }
      
      if (state.horses.length !== RACE_CONFIG.TOTAL_HORSES) {
        throw new Error(`Expected ${RACE_CONFIG.TOTAL_HORSES} horses, but found ${state.horses.length}`)
      }
      
      // Check if schedule already exists
      if (state.raceGenerated && state.raceSchedule.length > 0) {
        console.warn('Race schedule already exists, regenerating...')
      }

      // Predetermined distances for 6 rounds
      const distances = RACE_DISTANCES
      
      const schedule = []
      
      // Create 6 rounds with predetermined distances
      for (let roundNumber = 1; roundNumber <= RACE_CONFIG.TOTAL_ROUNDS; roundNumber++) {
        // Randomly select 10 horses from the available 20
        const availableHorses = [...state.horses]
        const participants = []
        
        // Fisher-Yates shuffle to randomly select 10 horses
        for (let i = 0; i < RACE_CONFIG.PARTICIPANTS_PER_RACE; i++) {
          if (availableHorses.length === 0) {
            throw new Error(`Not enough horses available for round ${roundNumber}`)
          }
          
          const randomIndex = Math.floor(Math.random() * availableHorses.length)
          const selectedHorse = availableHorses.splice(randomIndex, 1)[0]
          participants.push(selectedHorse)
        }
        
        // Validate participants
        if (participants.length !== RACE_CONFIG.PARTICIPANTS_PER_RACE) {
          throw new Error(`Failed to select exactly ${RACE_CONFIG.PARTICIPANTS_PER_RACE} participants for round ${roundNumber}`)
        }
        
        const round = {
          roundNumber,
          distance: distances[roundNumber - 1],
          participants,
          completed: false,
          results: []
        }
        
        schedule.push(round)
      }
      
      // Validate complete schedule
      if (schedule.length !== RACE_CONFIG.TOTAL_ROUNDS) {
        throw new Error(`Expected ${RACE_CONFIG.TOTAL_ROUNDS} rounds, but created ${schedule.length}`)
      }
      
      commit('SET_RACE_SCHEDULE', schedule)
      commit('SET_RACE_GENERATED', true)
      commit('SET_CURRENT_ROUND', 0) // Reset to first round
      console.log(`Successfully generated race schedule with ${RACE_CONFIG.TOTAL_ROUNDS} rounds`)
    } catch (error) {
      console.error('Error in generateRaceSchedule action:', error)
      throw error // Re-throw to allow component to handle
    }
  },

  // Race execution actions
  async startRaces({ commit, dispatch, state }) {
    try {
      // Validate prerequisites
      if (!state.raceGenerated || state.raceSchedule.length === 0) {
        throw new Error('Race schedule must be generated before starting races')
      }
      
      if (state.raceSchedule.length !== RACE_CONFIG.TOTAL_ROUNDS) {
        throw new Error(`Expected ${RACE_CONFIG.TOTAL_ROUNDS} rounds in schedule, but found ${state.raceSchedule.length}`)
      }
      
      if (state.isRacing) {
        throw new Error('Races are already in progress')
      }
      
      // Set racing state to true
      commit('SET_RACING_STATE', true)
      commit('SET_CURRENT_ROUND', 0)
      console.log('Starting race sequence...')
      
      // Execute races sequentially starting with Round 1
      for (let roundIndex = 0; roundIndex < state.raceSchedule.length; roundIndex++) {
        try {
          commit('SET_CURRENT_ROUND', roundIndex)
          const currentRound = state.raceSchedule[roundIndex]
          
          console.log(`Starting Round ${currentRound.roundNumber} (${currentRound.distance}m)`)
          
          // Validate round data
          if (!currentRound.participants || currentRound.participants.length !== RACE_CONFIG.PARTICIPANTS_PER_RACE) {
            throw new Error(`Invalid participants for Round ${currentRound.roundNumber}`)
          }
          
          // Run the single race for this round
          const raceResults = await dispatch('runSingleRace', currentRound)
          
          // Validate race results
          if (!raceResults || raceResults.length !== RACE_CONFIG.PARTICIPANTS_PER_RACE) {
            throw new Error(`Invalid race results for Round ${currentRound.roundNumber}`)
          }
          
          // Mark round as completed
          const updatedRound = { ...currentRound, completed: true, results: raceResults }
          const updatedSchedule = [...state.raceSchedule]
          updatedSchedule[roundIndex] = updatedRound
          commit('SET_RACE_SCHEDULE', updatedSchedule)
          
          // Complete the race and add to historical results
          await dispatch('completeRace', { roundIndex, results: raceResults })
          
          console.log(`Round ${currentRound.roundNumber} completed successfully`)
        } catch (roundError) {
          console.error(`Error in Round ${roundIndex + 1}:`, roundError)
          // Set racing state to false on error
          commit('SET_RACING_STATE', false)
          throw new Error(`Failed to complete Round ${roundIndex + 1}: ${roundError.message}`)
        }
      }
      
      // All races completed successfully
      commit('SET_RACING_STATE', false)
      console.log('All races completed successfully!')
    } catch (error) {
      console.error('Error in startRaces action:', error)
      // Ensure racing state is reset on any error
      commit('SET_RACING_STATE', false)
      throw error // Re-throw to allow component to handle
    }
  },

  async runSingleRace({ commit, state }, raceData) {
    try {
      // Validate race data
      if (!raceData || !raceData.participants || !raceData.distance || !raceData.roundNumber) {
        throw new Error('Invalid race data provided')
      }
      
      const { participants, distance, roundNumber } = raceData
      
      // Validate participants
      if (!Array.isArray(participants) || participants.length !== RACE_CONFIG.PARTICIPANTS_PER_RACE) {
        throw new Error(`Expected ${RACE_CONFIG.PARTICIPANTS_PER_RACE} participants, but received ${participants.length}`)
      }
      
      // Validate distance
      if (typeof distance !== 'number' || distance <= 0) {
        throw new Error(`Invalid race distance: ${distance}`)
      }
      
      console.log(`Running race for Round ${roundNumber} with ${participants.length} horses over ${distance}m`)
      
      // Reset horse positions for this race
      commit('RESET_HORSE_POSITIONS')
      
      // Initialize horse positions at start line
      const initialPositions = {}
      participants.forEach(horse => {
        if (!horse || !horse.id) {
          throw new Error('Invalid horse data in participants')
        }
        initialPositions[horse.id] = 0
      })
      commit('UPDATE_HORSE_POSITIONS', initialPositions)
      
      // Calculate finish times based purely on horse condition (no randomness)
      // Race duration is distance/1000 seconds (1200m = 1.2s, 1400m = 1.4s, etc.)
      const baseDuration = distance / 1000 // Convert distance to seconds
      
      const raceParams = participants.map(horse => {
        // Validate horse data
        if (!horse.condition || horse.condition < 1 || horse.condition > 100) {
          throw new Error(`Invalid horse condition for ${horse.name}: ${horse.condition}`)
        }
        
        // Higher condition = faster finish time
        // Best horse (condition 100) finishes at baseDuration
        // Worst horse (condition 1) finishes at baseDuration * 1.5
        const conditionFactor = horse.condition / 100 // 0.01 to 1.0
        const finishTime = baseDuration + (baseDuration * 0.5 * (1 - conditionFactor))
        
        return {
          horse,
          finishTime: Math.round(finishTime * 100) / 100, // Round to 2 decimal places
          speed: 100 / finishTime // Speed as percentage per second
        }
      })
      
      // Sort by finish time to determine order (fastest first)
      raceParams.sort((a, b) => a.finishTime - b.finishTime)
      
      // Validate race parameters
      if (raceParams.length !== participants.length) {
        throw new Error('Failed to calculate race parameters for all participants')
      }
      
      // Animate the race with position updates
      const updateInterval = RACE_CONFIG.UPDATE_INTERVAL // Update every 100ms for smoother animation
      const startTime = Date.now()
      
      return new Promise((resolve, reject) => {
        const animationTimer = setInterval(() => {
          try {
            const currentTime = Date.now()
            const elapsedTime = (currentTime - startTime) / 1000 // Convert to seconds
            
            // Update positions for each horse based on their individual finish times
            const newPositions = {}
            let allFinished = true
            
            raceParams.forEach(({ horse, finishTime }) => {
              let position = 0
              
              if (elapsedTime >= finishTime) {
                // Horse has finished - place at finish line
                position = 100
              } else {
                // Horse is still racing - calculate position based on progress
                position = (elapsedTime / finishTime) * 100
                allFinished = false
              }
              
              // Ensure position is within bounds
              position = Math.max(0, Math.min(position, 100))
              newPositions[horse.id] = Math.round(position * 100) / 100 // Round to 2 decimal places
            })
            
            commit('UPDATE_HORSE_POSITIONS', newPositions)
            
            // Check if all horses have finished
            if (allFinished) {
              clearInterval(animationTimer)
              
              try {
                // Ensure all horses are at finish line
                const finalPositions = {}
                participants.forEach(horse => {
                  finalPositions[horse.id] = 100
                })
                commit('UPDATE_HORSE_POSITIONS', finalPositions)
                
                // Create results based on finish times (already sorted)
                const rankedResults = raceParams.map((param, index) => ({
                  position: index + 1,
                  horse: param.horse,
                  finishTime: param.finishTime
                }))
                
                // Validate results
                if (rankedResults.length !== participants.length) {
                  throw new Error('Failed to generate complete race results')
                }
                
                // Update the race data with results
                const updatedRaceData = {
                  ...raceData,
                  results: rankedResults
                }
                
                // Update the race schedule with results
                const updatedSchedule = [...state.raceSchedule]
                const roundIndex = roundNumber - 1
                if (roundIndex >= 0 && roundIndex < updatedSchedule.length) {
                  updatedSchedule[roundIndex] = updatedRaceData
                  commit('SET_RACE_SCHEDULE', updatedSchedule)
                }
                
                console.log(`Race completed for Round ${roundNumber}`)
                console.log(`Winner: ${rankedResults[0].horse.name} (Condition: ${rankedResults[0].horse.condition}, Time: ${rankedResults[0].finishTime}s)`)
                resolve(rankedResults)
              } catch (finalizationError) {
                console.error('Error finalizing race results:', finalizationError)
                reject(finalizationError)
              }
            }
          } catch (animationError) {
            clearInterval(animationTimer)
            console.error('Error during race animation:', animationError)
            reject(animationError)
          }
        }, updateInterval)
      })
    } catch (error) {
      console.error('Error in runSingleRace action:', error)
      throw error // Re-throw to allow calling action to handle
    }
  },

  async completeRace({ commit, state }, { roundIndex, results }) {
    try {
      // Validate input parameters
      if (typeof roundIndex !== 'number' || roundIndex < 0) {
        throw new Error(`Invalid round index: ${roundIndex}`)
      }
      
      if (!Array.isArray(results) || results.length === 0) {
        throw new Error('Invalid race results provided')
      }
      
      // Validate results structure
      results.forEach((result, index) => {
        if (!result.position || !result.horse || typeof result.finishTime !== 'number') {
          throw new Error(`Invalid result structure at index ${index}`)
        }
      })
      
      // Validate round index is within bounds
      if (roundIndex >= state.raceSchedule.length) {
        throw new Error(`Round index ${roundIndex} is out of bounds`)
      }
      
      // Add race result to historical results
      const raceResult = {
        roundNumber: roundIndex + 1,
        distance: state.raceSchedule[roundIndex].distance,
        rankings: results,
        completedAt: new Date().toISOString() // Add timestamp
      }
      
      // Validate race result structure
      if (!raceResult.roundNumber || !raceResult.distance || !raceResult.rankings) {
        throw new Error('Failed to create valid race result')
      }
      
      commit('ADD_RACE_RESULT', raceResult)
      
      // Check if this is the final round
      const isFinalRound = roundIndex === state.raceSchedule.length - 1
      
      if (isFinalRound) {
        // Handle final round completion
        console.log('All races completed!')
        // Racing state will be set to false in startRaces after all rounds complete
      } else {
        // Automatic advancement to next round is handled by the loop in startRaces
        console.log(`Round ${roundIndex + 1} completed, advancing to Round ${roundIndex + 2}`)
      }
    } catch (error) {
      console.error('Error in completeRace action:', error)
      throw error // Re-throw to allow calling action to handle
    }
  },

  // Historical results management actions with error handling
  clearAllResults({ commit }) {
    try {
      commit('CLEAR_RACE_RESULTS')
      console.log('All race results cleared successfully')
    } catch (error) {
      console.error('Error clearing race results:', error)
      throw error
    }
  },

  updateRaceResult({ commit }, { roundNumber, updatedResult }) {
    try {
      // Validate input parameters
      if (typeof roundNumber !== 'number' || roundNumber < 1) {
        throw new Error(`Invalid round number: ${roundNumber}`)
      }
      
      if (!updatedResult || !updatedResult.rankings) {
        throw new Error('Invalid updated result provided')
      }
      
      commit('UPDATE_RACE_RESULT', { roundNumber, updatedResult })
      console.log(`Race result for Round ${roundNumber} updated successfully`)
    } catch (error) {
      console.error('Error updating race result:', error)
      throw error
    }
  },

  removeRaceResult({ commit }, roundNumber) {
    try {
      // Validate input parameter
      if (typeof roundNumber !== 'number' || roundNumber < 1) {
        throw new Error(`Invalid round number: ${roundNumber}`)
      }
      
      commit('REMOVE_RACE_RESULT', roundNumber)
      console.log(`Race result for Round ${roundNumber} removed successfully`)
    } catch (error) {
      console.error('Error removing race result:', error)
      throw error
    }
  },

  // Reset entire game state for new game with error handling
  resetGameState({ commit }) {
    try {
      commit('SET_HORSES', [])
      commit('SET_RACE_SCHEDULE', [])
      commit('SET_CURRENT_ROUND', 0)
      commit('CLEAR_RACE_RESULTS')
      commit('SET_RACING_STATE', false)
      commit('SET_RACE_GENERATED', false)
      commit('RESET_HORSE_POSITIONS')
      console.log('Game state reset successfully')
    } catch (error) {
      console.error('Error resetting game state:', error)
      throw error
    }
  }
}