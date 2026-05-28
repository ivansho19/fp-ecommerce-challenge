import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cart-quantity-control',
  standalone: true,
  imports: [NgClass],
  templateUrl: './cart-quantity-control.component.html',
  styleUrl: './cart-quantity-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartQuantityControlComponent {
  @Input() containerClass = 'h-12 w-full';
  @Input() buttonClass = 'h-10 w-10';
  @Input({ required: true }) quantity!: number;
  @Output() increment = new EventEmitter<void>();
  @Output() decrement = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();
}
