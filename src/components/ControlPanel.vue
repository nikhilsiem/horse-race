<template>
  <div class="control-panel">
    <button 
      @click="handleGenerateSchedule"
      :disabled="isRacing || !hasHorses"
      class="control-button generate-button"
      :class="{ disabled: isRacing || !hasHorses }"
    >
      Generate Schedule
    </button>
    <button 
      @click="handleStartRaces"
      :disabled="!canStartRaces"
      class="control-button start-button"
      :class="{ disabled: !canStartRaces }"
    >
      Start Races
    </button>
  </div>
</template>

<script setup>
import { useControlPanel } from '../composables/useControlPanel.js'

const {
  hasHorses,
  isRacing,
  canStartRaces,
  handleGenerateSchedule,
  handleStartRaces
} = useControlPanel()
</script>

<style scoped>
.control-panel {
  display: flex;
  gap: 0.5rem;
}

.control-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.control-button:hover:not(.disabled) {
  background: #f0f0f0;
}

.control-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>