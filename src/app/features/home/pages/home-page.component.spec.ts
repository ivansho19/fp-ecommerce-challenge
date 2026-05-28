import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { HomePageComponent } from './home-page.component';
import { ProductDataService } from '../../../core/services/product-data.service';
import { Product } from '../../../shared/models/product.models';

function buildProduct(index: number): Product {
  return {
    id: `product-${index}`,
    slug: `product-${index}`,
    images: [{ url: `/img/${index}.png`, alt: `Product ${index}` }],
    name: `Product ${index}`,
    unitLabel: 'unit',
    price: 100 + index,
    priceRegular: 150 + index,
    pricePromo: 120 + index,
    priceCard: 110 + index,
    variants: [
      {
        id: `variant-${index}`,
        sku: `SKU-${index}`,
        color: 'red',
        size: 'M',
        stock: 10
      }
    ],
    description: 'Sample description',
    relatedProducts: []
  };
}

describe('HomePageComponent', () => {
  let productService: jasmine.SpyObj<ProductDataService>;

  beforeEach(() => {
    productService = jasmine.createSpyObj<ProductDataService>('ProductDataService', ['getProducts']);
    productService.getProducts.and.returnValue(of(Array.from({ length: 10 }, (_, i) => buildProduct(i + 1))));

    TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        provideRouter([]),
        { provide: ProductDataService, useValue: productService }
      ]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should map products into cards and cap at 8', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const cards = component.cards();

    expect(cards.length).toBe(8);
    expect(cards[0].name).toBe('Product 1');
    expect(cards[0].href).toBe('/product/product-1');
    expect(cards[0].cartItem.unitPrice).toBe(121);
  });

  it('should track by id', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const component = fixture.componentInstance;

    expect(component.trackById(0, { id: 'test-id' })).toBe('test-id');
  });
});
