import { Injectable, computed, signal } from '@angular/core';

import { CartItem, CartProduct } from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly itemsState = signal<CartItem[]>([]);

  readonly items = this.itemsState.asReadonly();

  readonly totalItems = computed(() =>
    this.itemsState().reduce((total, item) => total + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this.itemsState().reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  );

  readonly totalCardPrice = computed(() =>
    this.itemsState().reduce((total, item) => {
      const price = item.cardPrice ?? item.unitPrice;
      return total + price * item.quantity;
    }, 0)
  );

  addToCart(product: CartProduct, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    this.itemsState.update((items) => {
      const index = items.findIndex((entry) => entry.id === product.id);
      if (index === -1) {
        return [...items, { ...product, quantity }];
      }

      return items.map((entry, currentIndex) =>
        currentIndex === index
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry
      );
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this.itemsState.update((items) =>
      items.map((entry) =>
        entry.id === productId ? { ...entry, quantity } : entry
      )
    );
  }

  removeFromCart(productId: string): void {
    this.itemsState.update((items) =>
      items.filter((entry) => entry.id !== productId)
    );
  }

  quantityFor(productId: string): number {
    return this.itemsState().find((entry) => entry.id === productId)?.quantity ?? 0;
  }
}
