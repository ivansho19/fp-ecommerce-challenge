export type AnalyticsEventName = 'view_item' | 'add_to_cart' | 'remove_from_cart';

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_variant?: string;
}

export interface ViewItemEvent {
  event: 'view_item';
  ecommerce: {
    items: AnalyticsItem[];
  };
}

export interface AddToCartEvent {
  event: 'add_to_cart';
  ecommerce: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
  };
}

export interface RemoveFromCartEvent {
  event: 'remove_from_cart';
  ecommerce: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
  };
}

export type AnalyticsEventPayload = ViewItemEvent | AddToCartEvent | RemoveFromCartEvent;
