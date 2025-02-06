<template>
  <FFmpegInit>
    <RouterView />
  </FFmpegInit>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import FFmpegInit from './components/FFmpegInit.vue';
</script>

<style>
/* Global styles */
:root {
  --primary-color: #3b82f6;
  --text-color: #1e293b;
  --background-color: #ffffff;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

button {
  font-family: inherit;
}

/* Remove default focus outline and add custom one */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Make images responsive by default */
img,
video {
  max-width: 100%;
  height: auto;
}
</style>
