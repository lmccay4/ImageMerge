# Image Merge

A small Angular 18 web app that blends two images together pixel by pixel, entirely in the browser using the Canvas API. No images are uploaded to a server.

## Features

- Select two images from your computer and preview them
- Choose a merge mode:
  - **Average (Blend)**: each pixel is the mean of the two source pixels
  - **Double Exposure**: a "screen" blend, like a double-exposed photo, where light areas add together and dark areas stay dark
- If the second image is a different size, it is scaled to match the first
- The merged result is shown on a canvas (right-click it to save it as an image)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.19 or newer
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm start
```

Open http://localhost:4200/. The app reloads automatically when you change a source file.

In VS Code, you can also run the **Start Development Server** task (the default build task, `Cmd+Shift+B` / `Ctrl+Shift+B`).

### Build for production

```bash
npm run build
```

The output goes to `dist/`. It is a static site, so you can host it on any static file server.

### Available scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm start`     | Start the dev server (`ng serve`)                |
| `npm run build` | Build for production (`ng build`)                |
| `npm run watch` | Rebuild on changes using the development config  |

## Usage

1. Choose a file for **Image 1**. Its dimensions set the size of the output.
2. Choose a file for **Image 2**.
3. Pick a **Merge Mode**.
4. Click **Merge Images**.
5. The result appears under **Merged Result**.

## How It Works

All of the logic is in [`image-merge.component.ts`](src/app/image-merge/image-merge.component.ts):

1. Each selected file is read with `FileReader`, drawn onto an offscreen canvas, and stored as `ImageData`.
2. When you click merge, Image 2 is scaled to Image 1's width and height if the sizes differ.
3. The app goes through the RGBA channels of every pixel and combines them:

   | Mode            | RGB formula                                   | Alpha           |
   | --------------- | --------------------------------------------- | --------------- |
   | Average         | `(a + b) / 2`                                 | `(a + b) / 2`   |
   | Double Exposure | `255 - ((255 - a) * (255 - b)) / 255`         | `(a + b) / 2`   |

4. The resulting `ImageData` is drawn onto the result canvas.

## Project Structure

```
src/
├── index.html
├── main.ts                      # Starts the standalone AppComponent
├── styles.scss                  # Global styles
└── app/
    ├── app.component.ts         # Page shell and title
    └── image-merge/
        ├── image-merge.component.ts    # File loading and merge logic
        ├── image-merge.component.html  # Upload, mode picker, result canvas
        └── image-merge.component.css
```

## Adding a Merge Mode

1. Add the new mode name to the `mergeMode` type (and the `performPixelMerge` parameter type) in `image-merge.component.ts`.
2. Add a branch for it in the pixel loop inside `performPixelMerge`.
3. Add an `<option>` for it to the `#merge-mode` dropdown in `image-merge.component.html`.

## Tech Stack

- Angular 18 (standalone components)
- TypeScript 5.4
- HTML Canvas API
