export interface Variant {
  id?: string;
  size: string;
  color: string;
  stock: number;
}


export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: (Variant & { id: string })[];
}

