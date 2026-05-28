export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  images: ProductImage[];
  name: string;
  unitLabel: string;
  price: number;
  priceRegular: number;
  pricePromo: number;
  priceCard: number;
  variants: ProductVariant[];
  description: string;
  relatedProducts: string[];
}
