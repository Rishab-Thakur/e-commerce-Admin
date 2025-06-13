export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: { $oid: string }[];
  createdAt: Date;
  updatedAt: Date;
}
