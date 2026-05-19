import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [style.height]="height" [style.width]="width" [class.circle]="circle">
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s infinite;
      border-radius: 4px;
      display: block;
      margin-bottom: 8px;
    }
    .skeleton-wrapper.circle { border-radius: 50%; }
    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() height = '16px';
  @Input() width = '100%';
  @Input() circle = false;
}
