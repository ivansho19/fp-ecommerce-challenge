import { Component, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs';

import { Product } from '../../../shared/models/product.models';
import { ProductDataService } from '../../../core/services/product-data.service';
import { ProductCardComponent } from '../../../shared/components/ui/product-card/product-card.component';
import { HeartButtonComponent } from '../../../shared/components/ui/heart-button/heart-button.component';
import { AccordionComponent, AccordionItem } from '../../../shared/components/ui/accordion/accordion.component';
import { CartStore } from '../../../shared/store/cart.store';
import { CartQuantityControlComponent } from '../../../shared/components/ui/cart-quantity-control/cart-quantity-control.component';
import { AddToCartButtonComponent } from '../../../shared/components/ui/add-to-cart-button/add-to-cart-button.component';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { toAnalyticsItem } from '../../../core/analytics/analytics.utils';
import { SkeletonComponent } from '../../../shared/components/ui/skeleton/skeleton.component';
import { CarouselControlsComponent } from '../../../shared/components/ui/carousel-controls/carousel-controls.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    CurrencyPipe,
    ProductCardComponent,
    HeartButtonComponent,
    AccordionComponent,
    CartQuantityControlComponent,
    AddToCartButtonComponent,
    SkeletonComponent,
    CarouselControlsComponent
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {
  private readonly productService = inject(ProductDataService);
  private readonly route = inject(ActivatedRoute);
  private readonly cartStore = inject(CartStore);
  private readonly analytics = inject(AnalyticsService);

  @ViewChild('crossSellTrack')
  private readonly crossSellTrack?: ElementRef<HTMLDivElement>;

  readonly activeImageIndex = signal(0);
  readonly selectedVariantId = signal<string | null>(null);
  readonly activeCarouselIndex = signal(0);
  readonly carouselPageSize = 3;

  readonly slug = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      startWith('')
    ),
    { initialValue: '' }
  );

  readonly products = toSignal(this.productService.getProducts({ delayMs: 500 }), {
    initialValue: []
  });

  readonly mostSearched = toSignal(this.productService.getMostSearched(), { initialValue: [] });

  readonly product = computed(() =>
    this.products().find((item) => item.slug === this.slug())
  );

  readonly relatedCards = computed(() => {
    const items = this.mostSearched();
    if (!items.length) {
      return [] as Array<{
        id: string;
        name: string;
        subtitle: string;
        imageUrl: string;
        imageAlt: string;
        badge: string;
        badgeTitle: string;
        badgeSubtitle: string;
        price1: string;
        price2: string;
        price3: string;
        discount: string;
        promo: string;
        href: string;
        cartItem: {
          id: string;
          name: string;
          unitPrice: number;
          imageUrl: string;
        };
      }>;
    }

    return items
      .map((entry) => {
        const product = this.products().find((item) => item.slug === entry.slug);
        if (!product) {
          return null;
        }

        return {
          id: product.id,
          name: product.name,
          subtitle: entry.subtitle,
          imageUrl: product.images[0]?.url ?? '',
          imageAlt: product.images[0]?.alt ?? product.name,
          badge: entry.badge,
          badgeTitle: entry.badgeTitle,
          badgeSubtitle: entry.badgeSubtitle,
          price1: `S/. ${product.priceRegular.toFixed(2)}`,
          price2: `S/. ${product.pricePromo.toFixed(2)}`,
          price3: `S/. ${product.priceCard.toFixed(2)}`,
          discount: entry.discount,
          promo: entry.promo,
          href: `/product/${product.slug}`,
          cartItem: {
            id: product.id,
            name: product.name,
            unitPrice: product.pricePromo,
            cardPrice: product.priceCard,
            imageUrl: product.images[0]?.url ?? ''
          }
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  });

  readonly carouselPages = computed(() => {
    const total = this.relatedCards().length;
    const pages = Math.ceil(total / this.carouselPageSize);
    return Array.from({ length: Math.max(pages, 1) }, (_, index) => index);
  });

  constructor() {
    effect(() => {
      const current = this.product();
      const defaultVariant = current?.variants[0]?.id ?? null;

      this.activeImageIndex.set(0);
      this.selectedVariantId.set(defaultVariant);
      this.activeCarouselIndex.set(0);

      if (current) {
        const variant = current.variants.find((item) => item.id === defaultVariant)?.size;
        this.analytics.trackViewItem(toAnalyticsItem(current, undefined, variant));
      }
    });
  }

  selectVariant(variantId: string): void {
    this.selectedVariantId.set(variantId);
  }

  setActiveImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  buildAccordionItems(item: Product): AccordionItem[] {
    return [
      { title: 'Descripcion larga', content: item.description },
      {
        title: 'Composicion',
        content: 'Formula con paracetamol, cafeina y vitaminas para aliviar el malestar.'
      },
      {
        title: 'Contraindicaciones',
        content: 'Consulta a tu medico antes de consumir en caso de alergias o tratamiento.'
      }
    ];
  }

  addToCart(item: Product): void {
    const variant = item.variants.find((entry) => entry.id === this.selectedVariantId())?.size;
    this.cartStore.addToCart({
      id: item.id,
      name: item.name,
      unitPrice: item.pricePromo,
      cardPrice: item.priceCard,
      imageUrl: item.images[0]?.url,
      variant
    });
    const quantity = this.cartStore.quantityFor(item.id);
    this.analytics.trackAddToCart({
      item_id: item.id,
      item_name: item.name,
      price: item.pricePromo,
      quantity,
      item_variant: variant
    });
  }

  quantityFor(item: Product): number {
    return this.cartStore.quantityFor(item.id);
  }

  increment(item: Product): void {
    const variant = item.variants.find((entry) => entry.id === this.selectedVariantId())?.size;
    this.cartStore.addToCart({
      id: item.id,
      name: item.name,
      unitPrice: item.pricePromo,
      cardPrice: item.priceCard,
      imageUrl: item.images[0]?.url,
      variant
    }, 1);
    const quantity = this.cartStore.quantityFor(item.id);
    this.analytics.trackAddToCart({
      item_id: item.id,
      item_name: item.name,
      price: item.pricePromo,
      quantity,
      item_variant: variant
    });
  }

  decrement(item: Product): void {
    const current = this.cartStore.quantityFor(item.id);
    if (current <= 1) {
      this.analytics.trackRemoveFromCart({
        item_id: item.id,
        item_name: item.name,
        price: item.pricePromo,
        quantity: current
      });
      this.cartStore.removeFromCart(item.id);
      return;
    }
    this.cartStore.updateQuantity(item.id, current - 1);
    this.analytics.trackRemoveFromCart({
      item_id: item.id,
      item_name: item.name,
      price: item.pricePromo,
      quantity: 1
    });
  }

  remove(item: Product): void {
    const current = this.cartStore.quantityFor(item.id);
    this.analytics.trackRemoveFromCart({
      item_id: item.id,
      item_name: item.name,
      price: item.pricePromo,
      quantity: current
    });
    this.cartStore.removeFromCart(item.id);
  }

  scrollCrossSell(direction: 'prev' | 'next'): void {
    const track = this.crossSellTrack?.nativeElement;
    if (!track) {
      return;
    }

    const delta = direction === 'next' ? track.clientWidth : -track.clientWidth;
    const nextIndex = direction === 'next'
      ? Math.min(this.activeCarouselIndex() + 1, this.carouselPages().length - 1)
      : Math.max(this.activeCarouselIndex() - 1, 0);

    this.activeCarouselIndex.set(nextIndex);
    track.scrollBy({ left: delta, behavior: 'smooth' });
  }

  goToCarouselPage(index: number): void {
    const track = this.crossSellTrack?.nativeElement;
    if (!track) {
      return;
    }

    const safeIndex = Math.min(Math.max(index, 0), this.carouselPages().length - 1);
    this.activeCarouselIndex.set(safeIndex);
    track.scrollTo({ left: track.clientWidth * safeIndex, behavior: 'smooth' });
  }
}
