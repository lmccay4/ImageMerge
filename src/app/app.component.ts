import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageMergeComponent } from './image-merge/image-merge.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ImageMergeComponent],
  template: `
    <div class="container">
      <h1>Image Pixel Merger</h1>
      <app-image-merge></app-image-merge>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
    }
    h1 {
      text-align: center;
      color: #333;
    }
  `]
})
export class AppComponent {
  title = 'Image Merge';
}
