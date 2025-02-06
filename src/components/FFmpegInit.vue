<template>
  <div v-if="error" class="error">
    Failed to initialize video processing: {{ error }}
  </div>
  <slot v-else-if="isLoaded" />
  <div v-else class="loading">
    Initializing video processor...
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useFFmpeg } from '../composables/useFFmpeg';

const { load, isLoaded } = useFFmpeg();
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    await load();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error';
    console.error('FFmpeg initialization failed:', err);
  }
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 1rem;
  color: #64748b;
}

.error {
  text-align: center;
  padding: 1rem;
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 4px;
  margin: 1rem;
}
</style>
