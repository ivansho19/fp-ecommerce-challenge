import { Injectable } from '@angular/core';

import { AnalyticsEventPayload, AnalyticsItem } from './analytics.types';
import {
  DEFAULT_CURRENCY,
  DATA_LAYER_NAME,
  EVENT_ADD_TO_CART,
  EVENT_REMOVE_FROM_CART,
  EVENT_VIEW_ITEM
} from './analytics.constants';
import { safeWindow } from './analytics.utils';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly seen = new Set<string>();

  trackViewItem(item: AnalyticsItem): void {
    const key = `${EVENT_VIEW_ITEM}:${item.item_id}`;
    if (this.seen.has(key)) {
      return;
    }
    this.seen.add(key);

    this.push({
      event: EVENT_VIEW_ITEM,
      ecommerce: {
        items: [item]
      }
    });
  }

  trackAddToCart(item: AnalyticsItem, currency = DEFAULT_CURRENCY): void {
    this.push({
      event: EVENT_ADD_TO_CART,
      ecommerce: {
        currency,
        value: (item.price ?? 0) * (item.quantity ?? 1),
        items: [item]
      }
    });
  }

  trackRemoveFromCart(item: AnalyticsItem, currency = DEFAULT_CURRENCY): void {
    this.push({
      event: EVENT_REMOVE_FROM_CART,
      ecommerce: {
        currency,
        value: (item.price ?? 0) * (item.quantity ?? 1),
        items: [item]
      }
    });
  }

  private push(payload: AnalyticsEventPayload): void {
    const win = safeWindow();
    if (!win) {
      return;
    }

    const host = win as { dataLayer?: AnalyticsEventPayload[] };
    if (!Array.isArray(host[DATA_LAYER_NAME])) {
      host[DATA_LAYER_NAME] = [];
    }

    host[DATA_LAYER_NAME]?.push(payload);
    console.log('[analytics]', payload.event, payload);
  }
}
