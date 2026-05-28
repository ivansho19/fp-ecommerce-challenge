import { Product } from '../../shared/models/product.models';
import { AnalyticsItem } from './analytics.types';

export function safeWindow(): Window | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return window;
}

export function toAnalyticsItem(product: Product, quantity?: number, variant?: string): AnalyticsItem {
  return {
    item_id: product.id,
    item_name: product.name,
    price: product.price,
    quantity,
    item_variant: variant
  };
}
