import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith } from 'rxjs';

import { ProductDataService } from '../../../core/services/product-data.service';
import { Product } from '../../../shared/models/product.models';
import { ProductCardComponent } from '../../../shared/components/ui/product-card/product-card.component';
import { SkeletonComponent } from '../../../shared/components/ui/skeleton/skeleton.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ProductCardComponent, SkeletonComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  private readonly productService = inject(ProductDataService);

  readonly state = toSignal(
    this.productService.getProducts({ delayMs: 1500 }).pipe(
      map((products) => ({ status: 'success' as const, products })),
      startWith({ status: 'loading' as const, products: [] as Product[] }),
      catchError(() => of({ status: 'success' as const, products: [] as Product[] }))
    ),
    { initialValue: { status: 'loading' as const, products: [] as Product[] } }
  );

  readonly cards = computed(() =>
    this.state().products.slice(0, 8).map((product) => ({
      id: product.id,
      name: product.name,
      subtitle: 'BOLSA 80 UN',
      imageUrl: product.images[0]?.url ?? '',
      imageAlt: product.images[0]?.alt ?? product.name,
      badge: '80 unidades',
      badgeTitle: 'Toallitas humedas',
      badgeSubtitle: 'Cuidado 4 en 1',
      price1: `S/. ${product.priceRegular.toFixed(2)}`,
      price2: `S/. ${product.pricePromo.toFixed(2)}`,
      price3: `S/. ${product.priceCard.toFixed(2)}`,
      discount: '-5%',
      promo: '-20%',
      href: `/product/${product.slug}`,
      cartItem: {
        id: product.id,
        name: product.name,
        unitPrice: product.pricePromo,
        cardPrice: product.priceCard,
        imageUrl: product.images[0]?.url ?? ''
      }
    }))
  );

  trackById(index: number, item: { id: string }): string {
    return item.id;
  }
}
