<template>
  <div class="editor">
    <header class="header">
      <h1>Clipper</h1>
      <p class="subtitle">Browser-based video editor</p>
    </header>

    <main class="main">
      <VideoUpload v-if="!store.videoFile" />
      
      <template v-else>
        <VideoPreview />
      </template>
    </main>

    <footer class="footer">
      <p>
        All processing is done locally in your browser.
        No videos are uploaded to any server.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useVideoStore } from '../stores/video';
import VideoUpload from '../components/VideoUpload.vue';
import VideoPreview from '../components/VideoPreview.vue';

const store = useVideoStore();
</script>

<style scoped>
.editor {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin: 0.5rem 0 0;
}

.main {
  flex: 1;
  width: 100%;
}

.footer {
  margin-top: 2rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
}
</style>
