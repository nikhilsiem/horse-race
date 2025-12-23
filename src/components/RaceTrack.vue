<template>
  <div class="race-track">
    <div v-if="!currentRace" class="no-race">
      <p>No active race</p>
      <p class="instruction">Generate a schedule and start races to see the track in action!</p>
    </div>
    <div v-else class="track-container">
      <div class="race-info">
        <h3>Round {{ currentRace.roundNumber }} - {{ currentRace.distance }}m</h3>
        <div class="race-status">
          <span v-if="isRacing" class="status racing">Racing in progress...</span>
          <span v-else-if="currentRace.completed" class="status completed">Race completed</span>
          <span v-else class="status ready">Ready to race ({{ currentRace.participants?.length || 0 }} horses)</span>
        </div>
      </div>
      
      <div class="track-lanes" :class="{ racing: isRacing }">
        <div 
          v-for="(horse, index) in currentRace.participants" 
          :key="horse.id"
          class="track-lane"
        >
          <div class="lane-number">{{ index + 1 }}</div>
          <div class="lane-track">
            <div class="start-line"></div>
            <div class="finish-line"></div>
            <div class="horse-name-track">{{ horse.name }}</div>
            <div 
              class="horse-marker"
              :style="{ 
                backgroundColor: horse.color,
                left: getHorsePosition(horse) + '%',
                transition: isRacing ? 'left 0.2s ease-out' : 'none'
              }"
              :class="{ 
                'finished': isRacing && getHorsePosition(horse) >= 100,
                'racing': isRacing && getHorsePosition(horse) < 100
              }"
              :title="`${horse.name} (Condition: ${horse.condition})`"
            >
              <img 
                src="/horse-running.svg.svg" 
                alt="Horse" 
                class="horse-image"
              />
            </div>
          </div>
          <div class="horse-condition">{{ horse.condition }}</div>
        </div>
      </div>
      
      <div class="track-legend">
        <div class="legend-item">
          <div class="legend-marker start"></div>
          <span>Start</span>
        </div>
        <div class="legend-item">
          <div class="legend-marker finish"></div>
          <span>Finish</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRaceTrack } from '../composables/useRaceTrack.js'

const { currentRace, isRacing, getHorsePosition } = useRaceTrack()
</script>

<style scoped>
.race-track {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
}

.no-race {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.track-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.race-info {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.race-info h3 {
  margin: 0 0 0.5rem 0;
}

.track-lanes {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.track-lane {
  display: grid;
  grid-template-columns: 30px 1fr 60px;
  align-items: center;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.lane-number {
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.lane-track {
  position: relative;
  height: 50px;
  background: #f0f0f0;
  margin: 0 0.5rem;
  border: 1px solid #ccc;
}

.start-line {
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background: green;
}

.finish-line {
  position: absolute;
  right: 3px;
  top: 3px;
  bottom: 3px;
  width: 3px;
  background: red;
}

.horse-name-track {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 0.8rem;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
}

.horse-marker {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  transition: left 0.2s ease-out;
  z-index: 2;
}

.horse-image {
  width: 28px;
  height: 28px;
}

.horse-condition {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
}

.track-legend {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  border-top: 1px solid #ccc;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-marker {
  width: 12px;
  height: 12px;
}

.legend-marker.start {
  background: green;
}

.legend-marker.finish {
  background: red;
}
</style>