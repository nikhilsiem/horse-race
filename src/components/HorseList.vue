<template>
  <div class="horse-list">
    <div v-if="horses.length === 0" class="no-horses">
      No horses generated yet
    </div>
    <div v-else class="horses-container">
      <div 
        v-for="horse in horses" 
        :key="horse.id"
        class="horse-item"
      >
        <div>
          <div class="horse-name">{{ horse.name }}</div>
          <div class="horse-condition">Condition: {{ horse.condition }}</div>
        </div>
        <div 
          class="horse-color-indicator" 
          :style="{ backgroundColor: horse.color }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

const horses = computed(() => {
  try {
    return store.state.horses || []
  } catch (error) {
    console.error('Error getting horses from store:', error)
    return []
  }
})

// Method to determine condition level for styling
const getConditionLevel = (condition) => {
  if (condition >= 80) return 'excellent'
  if (condition >= 60) return 'good'
  return 'fair'
}
</script>

<style scoped>
.horse-list {
  height: 100%;
  overflow-y: auto;
}

.no-horses {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.horses-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.horse-item {
  border: 1px solid #ccc;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.horse-name {
  font-weight: bold;
}

.horse-condition {
  font-size: 0.9rem;
  color: #666;
}

.horse-color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ccc;
}
</style>