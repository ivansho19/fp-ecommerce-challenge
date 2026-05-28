import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Product } from '../../shared/models/product.models';
import productsData from '../../../assets/mocks/products.json';
import mostSearchedData from '../../../assets/mocks/most-searched.json';

interface ProductResponse {
  products: Product[];
}

interface MostSearchedItem {
  id: string;
  slug: string;
  subtitle: string;
  badge: string;
  badgeTitle: string;
  badgeSubtitle: string;
  discount: string;
  promo: string;
}

interface MostSearchedResponse {
  items: MostSearchedItem[];
}

@Injectable({ providedIn: 'root' })
export class ProductDataService {
  getProducts(options?: { delayMs?: number; simulateError?: boolean }): Observable<Product[]> {
    const data = productsData as ProductResponse;
    const delayMs = options?.delayMs ?? 600;

    if (options?.simulateError) {
      return throwError(() => new Error('Mock error')).pipe(delay(delayMs));
    }

    return of(data.products).pipe(delay(delayMs));
  }

  getMostSearched(options?: { delayMs?: number }): Observable<MostSearchedItem[]> {
    const data = mostSearchedData as MostSearchedResponse;
    const delayMs = options?.delayMs ?? 300;

    return of(data.items).pipe(delay(delayMs));
  }
}
