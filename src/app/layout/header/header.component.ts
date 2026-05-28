import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartBadgeComponent } from '../../shared/components/ui/cart-badge/cart-badge.component';
import { CartStore } from '../../shared/store/cart.store';
import { CartItem } from '../../shared/models/cart.models';
import { PopoverComponent } from '../../shared/components/ui/popover/popover.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CartBadgeComponent, PopoverComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private readonly cartStore = inject(CartStore);
  readonly items = this.cartStore.items;
  readonly totalItems = this.cartStore.totalItems;
  readonly totalPrice = this.cartStore.totalPrice;
  readonly totalCardPrice = this.cartStore.totalCardPrice;

  remove(item: CartItem): void {
    this.cartStore.removeFromCart(item.id);
  }

  formatPrice(value: number): string {
    return `S/. ${value.toFixed(2)}`;
  }
}
