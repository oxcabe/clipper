<template>
  <div class="timeline">
    <div class="timeline-track" 
         ref="trackRef"
         @mousedown="handleTrackClick"
         @touchstart.prevent="handleTouchStart"
    >
      <!-- Progress bar -->
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
      
      <!-- Range selector -->
      <div
        class="range"
        :style="{
          left: `${(startTime / duration) * 100}%`,
          width: `${((endTime - startTime) / duration) * 100}%`
        }"
      >
        <!-- Left handle -->
        <div
          class="handle left"
          @mousedown.stop="startDrag('start', $event)"
          @touchstart.prevent.stop="startTouchDrag('start', $event)"
        />
        <!-- Right handle -->
        <div
          class="handle right"
          @mousedown.stop="startDrag('end', $event)"
          @touchstart.prevent.stop="startTouchDrag('end', $event)"
        />
      </div>
    </div>

    <!-- Time markers -->
    <div class="time-markers">
      <span>{{ formatTime(startTime) }}</span>
      <span>{{ formatTime(endTime) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useVideoStore } from '../stores/video';

const store = useVideoStore();

const props = defineProps<{
  progress: number;
}>();

// Refs
const trackRef = ref<HTMLElement | null>(null);
const dragging = ref<'start' | 'end' | null>(null);

// Computed
const startTime = computed(() => store.startTime);
const endTime = computed(() => store.endTime);
const duration = computed(() => store.duration);
const progress = computed(() => props.progress);

// Mouse Events
function startDrag(handle: 'start' | 'end', _event: MouseEvent) {
  dragging.value = handle;
  document.body.style.cursor = 'ew-resize';
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
}

function handleTrackClick(event: MouseEvent) {
  if (dragging.value || !trackRef.value) return;
  
  const rect = trackRef.value.getBoundingClientRect();
  const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const clickTime = percentage * duration.value;
  
  // Set the range around the clicked point
  const rangeWidth = endTime.value - startTime.value;
  const halfRange = rangeWidth / 2;
  const newStart = Math.max(0, clickTime - halfRange);
  const newEnd = Math.min(duration.value, clickTime + halfRange);
  
  store.setTimeRange(newStart, newEnd);
}

function handleMouseMove(event: MouseEvent) {
  if (!dragging.value || !trackRef.value) return;

  const track = trackRef.value;
  const rect = track.getBoundingClientRect();
  const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const time = percentage * duration.value;
  updateTimeRange(time);
}

function handleMouseUp() {
  dragging.value = null;
  document.body.style.cursor = '';
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
}

// Touch Events
function startTouchDrag(handle: 'start' | 'end', _event: TouchEvent) {
  dragging.value = handle;
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);
}

function handleTouchStart(event: TouchEvent) {
  if (!trackRef.value || event.touches.length !== 1) return;
  
  const touch = event.touches[0];
  const rect = trackRef.value.getBoundingClientRect();
  const percentage = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
  const touchTime = percentage * duration.value;
  
  const rangeWidth = endTime.value - startTime.value;
  const halfRange = rangeWidth / 2;
  const newStart = Math.max(0, touchTime - halfRange);
  const newEnd = Math.min(duration.value, touchTime + halfRange);
  
  store.setTimeRange(newStart, newEnd);
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault();
  if (!dragging.value || !trackRef.value || event.touches.length !== 1) return;

  const touch = event.touches[0];
  const track = trackRef.value;
  const rect = track.getBoundingClientRect();
  const percentage = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
  const time = percentage * duration.value;
  updateTimeRange(time);
}

function handleTouchEnd() {
  dragging.value = null;
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
}

// Shared
function updateTimeRange(time: number) {
  if (dragging.value === 'start') {
    if (time < endTime.value) {
      store.setTimeRange(Math.max(0, time), endTime.value);
    }
  } else {
    if (time > startTime.value) {
      store.setTimeRange(startTime.value, Math.min(duration.value, time));
    }
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Cleanup
onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('touchmove', handleTouchMove);
  window.removeEventListener('touchend', handleTouchEnd);
});

// Export component interface
export interface TimelineExpose {
  dragging: 'start' | 'end' | null;
  startTime: number;
  endTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
}

defineExpose<TimelineExpose>({
  dragging,
  startTime,
  endTime,
  duration,
  formatTime
});
</script>

<style scoped>
.timeline {
  width: 100%;
  padding: 1rem;
  user-select: none;
  touch-action: none;
}

.timeline-track {
  position: relative;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
}

.progress-bar {
  position: absolute;
  height: 100%;
  background-color: #3b82f6;
  border-radius: 4px;
  pointer-events: none;
}

.range {
  position: absolute;
  height: 100%;
  background-color: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
}

.handle {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 20px;
  background-color: #3b82f6;
  border-radius: 4px;
  transform: translate(-50%, -50%);
  cursor: ew-resize;
}

.handle.left {
  left: 0;
}

.handle.right {
  right: 0;
  transform: translate(50%, -50%);
}

.time-markers {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

@media (hover: none) {
  .handle {
    width: 16px; /* Larger touch target */
    height: 24px;
  }
}
</style>
