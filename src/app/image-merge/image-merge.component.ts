import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-merge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-merge.component.html',
  styleUrls: ['./image-merge.component.css']
})
export class ImageMergeComponent {
  image1Preview: string | null = null;
  image2Preview: string | null = null;
  mergedImageData: ImageData | null = null;
  isMerging = false;
  errorMessage: string | null = null;
  mergeMode: 'average' | 'doubleExposure' = 'average';

  private image1Data: ImageData | null = null;
  private image2Data: ImageData | null = null;

  onImageSelected(event: Event, imageType: 'image1' | 'image2'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          if (imageType === 'image1') {
            this.image1Data = imageData;
            this.image1Preview = e.target?.result as string;
          } else {
            this.image2Data = imageData;
            this.image2Preview = e.target?.result as string;
          }

          this.errorMessage = null;
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  mergeImages(): void {
    if (!this.image1Data || !this.image2Data) {
      this.errorMessage = 'Both images are required';
      return;
    }

    this.isMerging = true;
    this.errorMessage = null;

    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const merged = this.performPixelMerge(this.mergeMode);
        this.mergedImageData = merged;
        this.displayMergedImage();
        this.isMerging = false;
      } catch (error) {
        this.errorMessage = 'Error merging images: ' + (error as Error).message;
        this.isMerging = false;
      }
    }, 100);
  }

  private performPixelMerge(mode: 'average' | 'doubleExposure'): ImageData {
    if (!this.image1Data || !this.image2Data) {
      throw new Error('Images are required');
    }

    const img1 = this.image1Data;
    const img2 = this.image2Data;

    // Use the dimensions of the first image
    // Resize second image to match if needed
    const width = img1.width;
    const height = img1.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Draw the first image
    ctx.putImageData(img1, 0, 0);

    // If images have different dimensions, resize the second image
    let img2ToUse = img2;
    if (img2.width !== width || img2.height !== height) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        throw new Error('Could not get canvas context');
      }

      // Create a canvas from img2 to scale it
      const img2Canvas = document.createElement('canvas');
      img2Canvas.width = img2.width;
      img2Canvas.height = img2.height;
      const img2Ctx = img2Canvas.getContext('2d');
      if (!img2Ctx) {
        throw new Error('Could not get canvas context');
      }
      img2Ctx.putImageData(img2, 0, 0);

      // Scale to match first image dimensions
      tempCtx.drawImage(img2Canvas, 0, 0, img2.width, img2.height, 0, 0, width, height);
      img2ToUse = tempCtx.getImageData(0, 0, width, height);
    }

    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = width;
    mergedCanvas.height = height;
    const mergedCtx = mergedCanvas.getContext('2d');

    if (!mergedCtx) {
      throw new Error('Could not get canvas context');
    }

    // Create new ImageData for the merged result
    const mergedImageData = mergedCtx.createImageData(width, height);
    const data1 = img1.data;
    const data2 = img2ToUse.data;
    const mergedData = mergedImageData.data;

    // Merge pixels based on selected mode
    if (mode === 'average') {
      // Average RGB values
      for (let i = 0; i < data1.length; i += 4) {
        mergedData[i] = Math.round((data1[i] + data2[i]) / 2);     // R
        mergedData[i + 1] = Math.round((data1[i + 1] + data2[i + 1]) / 2); // G
        mergedData[i + 2] = Math.round((data1[i + 2] + data2[i + 2]) / 2); // B
        mergedData[i + 3] = Math.round((data1[i + 3] + data2[i + 3]) / 2); // A
      }
    } else if (mode === 'doubleExposure') {
      // Double exposure blend (screen blend mode)
      // Light areas become lighter, dark areas stay darker
      for (let i = 0; i < data1.length; i += 4) {
        mergedData[i] = Math.round(255 - ((255 - data1[i]) * (255 - data2[i])) / 255);     // R
        mergedData[i + 1] = Math.round(255 - ((255 - data1[i + 1]) * (255 - data2[i + 1])) / 255); // G
        mergedData[i + 2] = Math.round(255 - ((255 - data1[i + 2]) * (255 - data2[i + 2])) / 255); // B
        mergedData[i + 3] = Math.round((data1[i + 3] + data2[i + 3]) / 2); // A (average alpha)
      }
    }

    return mergedImageData;
  }

  private displayMergedImage(): void {
    const canvas = document.querySelector('canvas.merged-canvas') as HTMLCanvasElement;
    if (!canvas || !this.mergedImageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = this.mergedImageData.width;
    canvas.height = this.mergedImageData.height;
    ctx.putImageData(this.mergedImageData, 0, 0);
  }
}
