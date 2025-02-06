<template>
  <div
    class="upload-area"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @drop.prevent="handleDrop"
    :class="{ dragging: isDragging }"
  >
    <input
      type="file"
      ref="fileInput"
      accept="video/mp4"
      class="hidden"
      @change="handleFileSelect"
    />

    <div v-if="!store.videoFile" class="upload-prompt">
      <div class="icon">📁</div>
      <h3>Drop your video here</h3>
      <p>or</p>
      <button @click="triggerFileInput" class="select-button">
        Select Video
      </button>
      <p class="hint">Supports MP4 format</p>
    </div>

    <div v-else class="file-info">
      <div class="file-details">
        <span class="filename">{{ store.videoFile.name }}</span>
        <span class="filesize">{{ formatFileSize(store.videoFile.size) }}</span>
      </div>
      <button @click="store.reset" class="remove-button">
        Remove
      </button>
    </div>

    <div v-if="store.error" class="error-message">
      {{ store.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useVideoStore } from '../stores/video';

const store = useVideoStore();
const fileInput = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function triggerFileInput() {
  fileInput.value?.click();
}

async function handleFile(file: File) {
  if (!file.type.includes('video/mp4')) {
    store.setError('Please upload an MP4 video file');
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    store.setError('File size must be less than 500MB');
    return;
  }

  try {
    store.setVideo(file);
  } catch (error) {
    store.setError('Failed to process video file');
    console.error(error);
  }
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    handleFile(input.files[0]);
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file) {
    handleFile(file);
  }
}

function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
</script>

<style scoped>
.upload-area {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.dragging {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 3rem;
}

.hidden {
  display: none;
}

.select-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.select-button:hover {
  background-color: #2563eb;
}

.hint {
  color: #64748b;
  font-size: 0.875rem;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 4px;
}

.file-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.filename {
  font-weight: 500;
}

.filesize {
  color: #64748b;
  font-size: 0.875rem;
}

.remove-button {
  padding: 0.25rem 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #dc2626;
}

.error-message {
  margin-top: 1rem;
  padding: 0.5rem;
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 4px;
}
</style>
