export interface Order {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}
