import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-to-cart-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './add-to-cart-button.component.html',
  styleUrl: './add-to-cart-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToCartButtonComponent {
  @HostBinding('class') get hostClasses(): string {
    return this.hostClass;
  }

  @Input() label = 'Agregar al carrito';
  @Input() disabled = false;
  @Input() buttonClass = '';
  @Input() hostClass = '';
  @Output() action = new EventEmitter<void>();
}
