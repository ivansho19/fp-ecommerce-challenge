import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HeartButtonComponent } from '../heart-button/heart-button.component';
import { CartStore } from '../../../store/cart.store';
import { AnalyticsService } from '../../../../core/analytics/analytics.service';
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
  private readonly analytics = inject(AnalyticsService);

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
    const quantity = this.cartStore.quantityFor(this.cartItem.id);
    this.analytics.trackAddToCart({
      item_id: this.cartItem.id,
      item_name: this.cartItem.name,
      price: this.cartItem.unitPrice,
      quantity
    });
  }

  quantity(): number {
    return this.cartItem ? this.cartStore.quantityFor(this.cartItem.id) : 0;
  }

  increment(): void {
    if (!this.cartItem) {
      return;
    }
    this.cartStore.addToCart(this.cartItem, 1);
    const quantity = this.cartStore.quantityFor(this.cartItem.id);
    this.analytics.trackAddToCart({
      item_id: this.cartItem.id,
      item_name: this.cartItem.name,
      price: this.cartItem.unitPrice,
      quantity
    });
  }

  decrement(): void {
    if (!this.cartItem) {
      return;
    }
    const current = this.cartStore.quantityFor(this.cartItem.id);
    if (current <= 1) {
      this.analytics.trackRemoveFromCart({
        item_id: this.cartItem.id,
        item_name: this.cartItem.name,
        price: this.cartItem.unitPrice,
        quantity: current
      });
      this.cartStore.removeFromCart(this.cartItem.id);
      return;
    }
    this.cartStore.updateQuantity(this.cartItem.id, current - 1);
    this.analytics.trackRemoveFromCart({
      item_id: this.cartItem.id,
      item_name: this.cartItem.name,
      price: this.cartItem.unitPrice,
      quantity: 1
    });
  }

  remove(): void {
    if (!this.cartItem) {
      return;
    }
    const current = this.cartStore.quantityFor(this.cartItem.id);
    this.analytics.trackRemoveFromCart({
      item_id: this.cartItem.id,
      item_name: this.cartItem.name,
      price: this.cartItem.unitPrice,
      quantity: current
    });
    this.cartStore.removeFromCart(this.cartItem.id);
  }
}
