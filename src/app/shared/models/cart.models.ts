export interface CartProduct {
  id: string;
  name: string;
  unitPrice: number;
  cardPrice?: number;
  imageUrl?: string;
  variant?: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}
