/**
 * Vuex Store State
 * Centralized state management for the horse racing game
 */

export default {
  // Horse management
  horses: [],
  
  // Race scheduling and management
  raceSchedule: [],
  currentRound: 0,
  isRacing: false,
  raceGenerated: false,
  
  // Race execution
  horsePositions: {}, // Track horse positions during races
  
  // Results management
  raceResults: [] // Historical results for all completed races
}