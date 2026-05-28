import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-heart-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './heart-button.component.html',
  styleUrl: './heart-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeartButtonComponent {
  @Input() ariaLabel = 'Favorito';
  @Input() sizeClass = 'h-12 w-12';
}
