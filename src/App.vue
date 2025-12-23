<template>
  <div id="app">
    <header>
      <h1>Horse Racing Game</h1>
      <ControlPanel />
    </header>
    <main class="game-layout">
      <div class="horse-list-panel">
        <h2>Horses</h2>
        <HorseList />
      </div>
      <div class="race-track-panel">
        <h2>Race Track</h2>
        <RaceTrack />
      </div>
      <div class="results-panel">
        <h2>Results</h2>
        <RaceResults />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import HorseList from './components/HorseList.vue'
import ControlPanel from './components/ControlPanel.vue'
import RaceTrack from './components/RaceTrack.vue'
import RaceResults from './components/RaceResults.vue'

const store = useStore()

// Generate horses on app initialization with error handling
const initializeHorses = async () => {
  try {
    if (store.state.horses.length === 0) {
      await store.dispatch('generateHorses')
      console.log('Horses generated successfully on app initialization')
    }
  } catch (error) {
    console.error('Error generating horses on app initialization:', error)
    // Don't show alert on initialization, just log the error
    // The user can manually trigger horse generation if needed
  }
}

// Initialize horses when component mounts
onMounted(() => {
  initializeHorses()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: #f0f0f0;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  min-height: 0;
}

.horse-list-panel,
.race-track-panel,
.results-panel {
  border: 1px solid #ccc;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.horse-list-panel h2,
.race-track-panel h2,
.results-panel h2 {
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}
</style>