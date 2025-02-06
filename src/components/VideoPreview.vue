<template>
  <div class="video-preview">
    <div class="video-container">
      <video
        ref="videoRef"
        @loadedmetadata="handleMetadata"
        @timeupdate="handleTimeUpdate"
        @ended="handleEnded"
        controls
      >
        <source :src="videoUrl" type="video/mp4" v-if="videoUrl" />
      </video>

      <div v-if="store.isProcessing" class="processing-overlay">
        <div class="spinner"></div>
        <p>Processing video...</p>
      </div>
    </div>

    <div class="controls" v-if="videoUrl">
      <Timeline :progress="progress" />
      
      <div class="actions">
        <label class="audio-toggle">
          <input
            type="checkbox"
            :checked="store.hasAudio"
            @change="store.toggleAudio"
          />
          <span class="label">Include Audio</span>
        </label>

        <button
          @click="handleExport"
          :disabled="store.isProcessing"
          class="export-button"
        >
          {{ store.isProcessing ? 'Processing...' : 'Export Clip' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useVideoStore } from '../stores/video';
import { useFFmpeg } from '../composables/useFFmpeg';
import Timeline from './Timeline.vue';

const store = useVideoStore();
const { clipVideo } = useFFmpeg();

const videoRef = ref<HTMLVideoElement | null>(null);
const progress = ref(0);
const currentUrl = ref<string>('');

const videoUrl = computed(() => currentUrl.value);

// Use watchEffect to handle URL creation and cleanup
watchEffect((onCleanup) => {
  if (store.videoFile) {
    const url = URL.createObjectURL(store.videoFile);
    currentUrl.value = url;
    
    // Cleanup function runs when dependency changes or component unmounts
    onCleanup(() => {
      URL.revokeObjectURL(url);
      currentUrl.value = '';
    });
  }
});

function handleMetadata() {
  if (!videoRef.value) return;
  store.setDuration(videoRef.value.duration);
}

function handleTimeUpdate() {
  if (!videoRef.value) return;
  progress.value = (videoRef.value.currentTime / store.duration) * 100;
}

function handleEnded() {
  if (!videoRef.value) return;
  videoRef.value.currentTime = store.startTime;
}

async function handleExport() {
  if (!store.videoFile) return;

  try {
    store.setProcessing(true);
    store.setError(null);

    const outputBlob = await clipVideo({
      inputFile: store.videoFile,
      startTime: store.startTime,
      endTime: store.endTime,
      hasAudio: store.hasAudio,
    });

    // Create download link
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clipped_${store.videoFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    store.setError('Failed to export video clip');
    console.error(error);
  } finally {
    store.setProcessing(false);
  }
}
</script>

<style scoped>
.video-preview {
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.video-container {
  position: relative;
  width: 100%;
  background-color: #000;
  aspect-ratio: 16 / 9;
  margin-bottom: 1rem;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.controls {
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.audio-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.export-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.export-button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
