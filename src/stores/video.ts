import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { ref } from 'vue';

interface VideoState {
  videoFile: File | null;
  startTime: number;
  endTime: number;
  duration: number;
  isProcessing: boolean;
  hasAudio: boolean;
  error: string | null;
}

export const useVideoStore = defineStore('video', () => {
  const videoFile: Ref<File | null> = ref(null);
  const startTime = ref(0);
  const endTime = ref(0);
  const duration = ref(0);
  const isProcessing = ref(false);
  const hasAudio = ref(true);
  const error = ref<string | null>(null);

  function setVideo(file: File) {
    videoFile.value = file;
    error.value = null;
  }

  function setTimeRange(start: number, end: number) {
    if (start >= 0 && end <= duration.value && start < end) {
      startTime.value = start;
      endTime.value = end;
      error.value = null;
    } else {
      error.value = 'Invalid time range';
    }
  }

  function setDuration(time: number) {
    duration.value = time;
    endTime.value = time;
  }

  function toggleAudio() {
    hasAudio.value = !hasAudio.value;
  }

  function setProcessing(processing: boolean) {
    isProcessing.value = processing;
  }

  function setError(message: string | null) {
    error.value = message;
  }

  function reset() {
    videoFile.value = null;
    startTime.value = 0;
    endTime.value = 0;
    duration.value = 0;
    isProcessing.value = false;
    hasAudio.value = true;
    error.value = null;
  }

  return {
    // State
    videoFile,
    startTime,
    endTime,
    duration,
    isProcessing,
    hasAudio,
    error,
    // Actions
    setVideo,
    setTimeRange,
    setDuration,
    toggleAudio,
    setProcessing,
    setError,
    reset
  };
});
