import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { provideRouter, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ProductPageComponent } from './product-page.component';
import { ProductDataService } from '../../../core/services/product-data.service';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { CartStore } from '../../../shared/store/cart.store';
import { Product } from '../../../shared/models/product.models';

function buildProduct(id: string, slug: string): Product {
  return {
    id,
    slug,
    images: [{ url: `/img/${id}.png`, alt: `Product ${id}` }],
    name: `Product ${id}`,
    unitLabel: 'unit',
    price: 100,
    priceRegular: 150,
    pricePromo: 120,
    priceCard: 110,
    variants: [
      { id: 'v1', sku: 'SKU-1', color: 'red', size: 'M', stock: 10 },
      { id: 'v2', sku: 'SKU-2', color: 'blue', size: 'XL', stock: 5 }
    ],
    description: 'Sample description',
    relatedProducts: []
  };
}

describe('ProductPageComponent', () => {
  let productService: jasmine.SpyObj<ProductDataService>;
  let analytics: jasmine.SpyObj<AnalyticsService>;
  let cartStore: jasmine.SpyObj<CartStore>;

  const product = buildProduct('p1', 'product-1');

  beforeEach(() => {
    productService = jasmine.createSpyObj<ProductDataService>('ProductDataService', ['getProducts', 'getMostSearched']);
    analytics = jasmine.createSpyObj<AnalyticsService>('AnalyticsService', [
      'trackViewItem',
      'trackAddToCart',
      'trackRemoveFromCart'
    ]);
    cartStore = jasmine.createSpyObj<CartStore>('CartStore', [
      'addToCart',
      'removeFromCart',
      'updateQuantity',
      'quantityFor'
    ]);

    productService.getProducts.and.returnValue(of([product]));
    productService.getMostSearched.and.returnValue(of([
      {
        id: 'ms-1',
        slug: 'product-1',
        subtitle: 'Top',
        badge: 'Badge',
        badgeTitle: 'Title',
        badgeSubtitle: 'Subtitle',
        discount: '-5%',
        promo: '-20%'
      }
    ]));
    cartStore.quantityFor.and.returnValue(2);

    TestBed.configureTestingModule({
      imports: [ProductPageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductDataService, useValue: productService },
        { provide: AnalyticsService, useValue: analytics },
        { provide: CartStore, useValue: cartStore },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ slug: 'product-1' }))
          }
        }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should select default variant and track view item', fakeAsync(() => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    fixture.detectChanges();
    flush();

    const component = fixture.componentInstance;
    expect(component.selectedVariantId()).toBe('v1');
    expect(analytics.trackViewItem).toHaveBeenCalledTimes(1);
  }));

  it('should build related cards from most searched items', fakeAsync(() => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    fixture.detectChanges();
    flush();

    const component = fixture.componentInstance;
    const related = component.relatedCards();

    expect(related.length).toBe(1);
    expect(related[0].id).toBe('p1');
    expect(related[0].href).toBe('/product/product-1');
  }));

  it('should add to cart with selected variant size', () => {
    const fixture = TestBed.createComponent(ProductPageComponent);
    const component = fixture.componentInstance;

    component.selectVariant('v2');
    component.addToCart(product);

    expect(cartStore.addToCart).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 'p1',
        name: 'Product p1',
        unitPrice: 120,
        cardPrice: 110,
        variant: 'XL'
      })
    );
  });

  it('should remove from cart when decrement goes below 1', () => {
    cartStore.quantityFor.and.returnValue(1);
    const fixture = TestBed.createComponent(ProductPageComponent);
    const component = fixture.componentInstance;

    component.decrement(product);

    expect(cartStore.removeFromCart).toHaveBeenCalledWith('p1');
  });
});
