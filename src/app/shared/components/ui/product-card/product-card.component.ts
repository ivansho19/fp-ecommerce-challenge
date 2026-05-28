import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeartButtonComponent } from '../heart-button/heart-button.component';
import { CartStore } from '../../../store/cart.store';
import { CartProduct } from '../../../models/cart.models';
import { CartQuantityControlComponent } from '../cart-quantity-control/cart-quantity-control.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, HeartButtonComponent, CartQuantityControlComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  private readonly cartStore = inject(CartStore);

  @Input({ required: true }) name!: string;
  @Input({ required: true }) subtitle!: string;
  @Input({ required: true }) imageUrl!: string;
  @Input({ required: true }) imageAlt!: string;
  @Input({ required: true }) href!: string;
  @Input() cartItem?: CartProduct;
  @Input() badge = '80 unidades';
  @Input() badgeTitle = 'Toallitas humedas';
  @Input() badgeSubtitle = 'Cuidado 4 en 1';
  @Input() price1 = 'S/. 0.00';
  @Input() price2 = 'S/. 0.00';
  @Input() price3 = 'S/. 0.00';
  @Input() discount = '-5%';
  @Input() promo = '-20%';
  @Input() ctaLabel = 'Agregar al carrito';

  addToCart(): void {
    if (!this.cartItem) {
      return;
    }
    this.cartStore.addToCart(this.cartItem);
  }

  quantity(): number {
    return this.cartItem ? this.cartStore.quantityFor(this.cartItem.id) : 0;
  }

  increment(): void {
    if (!this.cartItem) {
      return;
    }
    this.cartStore.addToCart(this.cartItem, 1);
  }

  decrement(): void {
    if (!this.cartItem) {
      return;
    }
    const current = this.cartStore.quantityFor(this.cartItem.id);
    if (current <= 1) {
      this.cartStore.removeFromCart(this.cartItem.id);
      return;
    }
    this.cartStore.updateQuantity(this.cartItem.id, current - 1);
  }

  remove(): void {
    if (!this.cartItem) {
      return;
    }
    this.cartStore.removeFromCart(this.cartItem.id);
  }
}
