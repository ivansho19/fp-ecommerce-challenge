import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface AccordionItem {
  title: string;
  content: string;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  @Input() heading = 'Descripcion larga';
  @Input() items: AccordionItem[] = [];
}
