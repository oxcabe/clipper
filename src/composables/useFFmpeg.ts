import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ref } from 'vue';

const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.9/dist/esm'
const ffmpeg = ref<FFmpeg | null>(null);
const isLoaded = ref(false);

export function useFFmpeg() {
  const progress = ref(0);

  async function load() {
    if (isLoaded.value) return;

    const instance = new FFmpeg();
    
    instance.on('progress', ({ progress: p }) => {
      progress.value = p;
    });

    try {
      await instance.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
          workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
      });
      
      ffmpeg.value = instance;
      isLoaded.value = true;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Failed to initialize video processing');
    }
  }

  async function clipVideo({
    inputFile,
    startTime,
    endTime,
    hasAudio
  }: {
    inputFile: File;
    startTime: number;
    endTime: number;
    hasAudio: boolean;
  }): Promise<Blob> {
    if (!ffmpeg.value || !isLoaded.value) {
      throw new Error('FFmpeg not initialized');
    }

    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';

    try {
      // Write input file to memory
      await ffmpeg.value.writeFile(inputFileName, await fetchFile(inputFile));

      // Construct FFmpeg command
      const duration = endTime - startTime;
      const audioFlag = hasAudio ? '' : '-an';
      
      // Execute FFmpeg command
      await ffmpeg.value.exec([
        '-i', inputFileName,
        '-ss', startTime.toString(),
        '-t', duration.toString(),
        audioFlag,
        '-c:v', 'copy',
        ...(hasAudio ? ['-c:a', 'copy'] : []),
        outputFileName
      ].filter(Boolean));

      // Read the output file
      const data = await ffmpeg.value.readFile(outputFileName);
      
      // Clean up
      await ffmpeg.value.deleteFile(inputFileName);
      await ffmpeg.value.deleteFile(outputFileName);

      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error processing video:', error);
      throw new Error('Failed to process video');
    }
  }

  return {
    isLoaded,
    load,
    clipVideo
  };
}
