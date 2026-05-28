import { Component, Input } from '@angular/core';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';

type SkeletonVariant = 'card' | 'pdp';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss'
})
export class SkeletonComponent {
  @Input() variant: SkeletonVariant = 'card';
  @Input() count = 1;

  get items(): number[] {
    const safeCount = Math.max(this.count, 1);
    return Array.from({ length: safeCount }, (_, index) => index);
  }
}
