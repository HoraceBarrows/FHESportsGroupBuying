export interface Product {
  id: number;
  name: string;
  description: string;
  unitPrice: bigint;
  minOrderQuantity: bigint;
  maxOrderQuantity: bigint;
  category: number;
  deadline: bigint;
  active: boolean;
  currentOrders: bigint;
  totalCollected: bigint;
}

export interface Order {
  id: number;
  productId: bigint;
  buyer: string;
  timestamp: bigint;
  status: number;
  isRevealed: boolean;
  revealedQuantity: bigint;
  revealedAmount: bigint;
}

export interface ProductFormData {
  productName: string;
  productDescription: string;
  productCategory: string;
  unitPrice: string;
  minQuantity: string;
  maxQuantity: string;
  deadline: string;
}
