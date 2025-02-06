# Clipper

A web-based video clip extraction tool built with Vue.js and FFmpeg. Clipper allows you to extract segments from videos directly in your browser using WebAssembly-powered FFmpeg processing.

## Features

- In-browser video clip extraction
- Real-time video preview with custom controls
- Timeline-based segment selection
- Audio toggle support
- Progress tracking with visual feedback
- MP4 video processing via FFmpeg WebAssembly
- TypeScript integration
- Nix development environment

## Prerequisites

- Node.js (latest LTS recommended)
- Nix package manager (optional, for development environment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/oxcabe/clipper
cd clipper
```

2. Install dependencies:
```bash
npm install
```

3. If using Nix:
```bash
nix develop
```

## Development

Start the development server:

```bash
npm run dev
```

This will start a local development server with hot-reload enabled.

## Project Structure

```
clipper/
├── public/           # Public assets and FFmpeg WASM files
├── src/
│   ├── components/   # Vue components
│   ├── composables/  # Vue composables (custom hooks)
│   ├── router/      # Vue Router configuration
│   ├── stores/      # State management
│   ├── views/       # Page components
│   └── workers/     # Web Workers
└── ...config files
```

### Key Components

- `VideoPreview.vue`: Handles video playback and preview with progress tracking
- `Timeline.vue`: Timeline interface for segment selection
- `FFmpegInit.vue`: Initializes FFmpeg WASM runtime
- `VideoUpload.vue`: Handles video file uploads
- `useFFmpeg.ts`: FFmpeg WebAssembly integration composable

## Technical Implementation

### FFmpeg Integration

- Uses FFmpeg Core MT (multi-threaded) v0.12.9
- WebAssembly-based processing with web worker support
- Copy-mode video operations for fast processing
- Progress tracking for processing feedback
- Proper memory management with automatic cleanup
- Efficient stream handling using FFmpeg's native capabilities

### Video Processing

- Support for MP4 video format
- Fast clip extraction using stream copying
- Optional audio track preservation
- Memory-efficient processing using file streams
- Real-time progress updates during processing

### Timeline Interface

- Interactive clip range selection
- Draggable handles for precise time selection
- Visual progress tracking with progress bar
- Time markers with formatted timestamps
- Responsive design with touch support
- Mobile-optimized controls with larger touch targets
- Smooth drag interactions for both mouse and touch

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## License

See [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.
