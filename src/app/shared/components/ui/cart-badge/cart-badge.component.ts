import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartStore } from '../../../store/cart.store';

@Component({
  selector: 'app-cart-badge',
  standalone: true,
  imports: [],
  templateUrl: './cart-badge.component.html',
  styleUrl: './cart-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartBadgeComponent {
  private readonly cartStore = inject(CartStore);

  readonly count = this.cartStore.totalItems;
}
