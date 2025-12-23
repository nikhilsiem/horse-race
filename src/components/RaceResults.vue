<template>
  <div class="race-results">
    <div v-if="!hasResults" class="no-results">
      <p>No race results yet. Generate a race schedule and start racing!</p>
    </div>
    
    <div v-else class="results-container">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button 
          @click="activeTab = 'current'"
          :class="{ active: activeTab === 'current' }"
          class="tab-button"
        >
          Current Result
        </button>
        <button 
          @click="activeTab = 'history'"
          :class="{ active: activeTab === 'history' }"
          class="tab-button"
        >
          All Results ({{ raceResults.length }})
        </button>
      </div>

      <!-- Current Result Tab -->
      <div v-if="activeTab === 'current'" class="tab-content">
        <div v-if="latestResult" class="current-result">
          <h3>Round {{ latestResult.roundNumber }} - {{ latestResult.distance }}m</h3>
          <p class="race-time">Completed at: {{ formatTime(latestResult.completedAt) }}</p>
          <div class="rankings">
            <div 
              v-for="ranking in latestResult.rankings" 
              :key="ranking.horse.id"
              class="ranking-item"
              :class="{ 'winner': ranking.position === 1 }"
            >
              <span class="position">{{ ranking.position }}</span>
              <span 
                class="horse-color" 
                :style="{ backgroundColor: ranking.horse.color }"
              ></span>
              <span class="horse-name">{{ ranking.horse.name }}</span>
              <span class="finish-time">{{ ranking.finishTime }}s</span>
            </div>
          </div>
        </div>
        <div v-else class="no-current">
          <p>No current race result available.</p>
        </div>
      </div>

      <!-- Historical Results Tab -->
      <div v-if="activeTab === 'history'" class="tab-content">
        <div class="historical-results">
          <h4>All Race Results</h4>
          <div class="accordion">
            <div 
              v-for="result in raceResults" 
              :key="result.roundNumber"
              class="accordion-item"
            >
              <button 
                @click="toggleAccordion(result.roundNumber)"
                :class="{ active: openAccordions.includes(result.roundNumber) }"
                class="accordion-header"
              >
                <span class="round-info">
                  <strong>Round {{ result.roundNumber }}</strong> - {{ result.distance }}m
                </span>
                <span class="race-time">{{ formatTime(result.completedAt) }}</span>
                <span class="winner-info">Winner: {{ result.rankings[0].horse.name }}</span>
                <span class="accordion-icon">
                  {{ openAccordions.includes(result.roundNumber) ? '−' : '+' }}
                </span>
              </button>
              
              <div 
                v-if="openAccordions.includes(result.roundNumber)"
                class="accordion-content"
              >
                <div class="rankings">
                  <div 
                    v-for="ranking in result.rankings" 
                    :key="ranking.horse.id"
                    class="ranking-item"
                    :class="{ 'winner': ranking.position === 1 }"
                  >
                    <span class="position">{{ ranking.position }}</span>
                    <span 
                      class="horse-color" 
                      :style="{ backgroundColor: ranking.horse.color }"
                    ></span>
                    <span class="horse-name">{{ ranking.horse.name }}</span>
                    <span class="finish-time">{{ ranking.finishTime }}s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRaceResults } from '../composables/useRaceResults.js'

const activeTab = ref('current')
const openAccordions = ref([])

const { raceResults, hasResults, latestResult, formatTime } = useRaceResults()

const toggleAccordion = (roundNumber) => {
  try {
    if (typeof roundNumber !== 'number' || roundNumber < 1) {
      console.warn('Invalid round number provided:', roundNumber)
      return
    }
    
    const index = openAccordions.value.indexOf(roundNumber)
    if (index > -1) {
      openAccordions.value.splice(index, 1)
    } else {
      openAccordions.value.push(roundNumber)
    }
  } catch (error) {
    console.error('Error toggling accordion:', error)
  }
}
</script>

<style scoped>
.race-results {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.results-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.tab-button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  background: white;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  background: #f0f0f0;
}

.tab-button.active {
  border-bottom-color: #007bff;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.current-result {
  border: 1px solid #ccc;
  padding: 1rem;
}

.current-result h3 {
  margin: 0 0 0.5rem 0;
}

.race-time {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

.accordion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion-item {
  border: 1px solid #ccc;
}

.accordion-header {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: #f0f0f0;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.accordion-header:hover {
  background: #e0e0e0;
}

.accordion-content {
  padding: 1rem;
  background: white;
}

.rankings {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

.ranking-item.winner {
  background: #ffffcc;
  font-weight: bold;
}

.position {
  font-weight: bold;
  min-width: 1.5rem;
  text-align: center;
}

.horse-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.horse-name {
  flex-grow: 1;
}

.finish-time {
  font-family: monospace;
  color: #666;
  font-size: 0.9rem;
}
</style>