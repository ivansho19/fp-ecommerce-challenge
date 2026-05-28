import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-carousel-controls',
  standalone: true,
  imports: [NgClass],
  templateUrl: './carousel-controls.component.html',
  styleUrl: './carousel-controls.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselControlsComponent {
  @Input() containerClass = 'flex gap-2';
  @Input() prevButtonClass = 'h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-500';
  @Input() nextButtonClass = 'h-9 w-9 rounded-full border border-brand-primary bg-brand-primary text-white';
    @Input() prevLabel = '<';
    @Input() nextLabel = '>';
  @Input() prevAriaLabel = 'Anterior';
  @Input() nextAriaLabel = 'Siguiente';

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
