# Image Merge

An Angular web application that merges two images pixel by pixel by averaging their RGB values.

## Features

- Upload two images via file input
- Preview selected images
- Merge images by averaging pixel values
- Automatically scales images to match dimensions
- Display merged result in the browser

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

### Development Server

Run the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any source files.

### Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

1. Open the application in your browser
2. Click "Image 1" to select the first image
3. Click "Image 2" to select the second image
4. Click the "Merge Images" button
5. View the merged result below

## How It Works

The merger works by:
1. Loading both images as ImageData objects from canvas
2. If images have different dimensions, the second image is scaled to match the first
3. Iterating through each pixel's RGBA values
4. Averaging the red, green, blue, and alpha channels between the two images
5. Displaying the result on a canvas

## Technology Stack

- Angular 18
- TypeScript
- Canvas API
