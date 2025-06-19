// export interface Order {
//   id: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
//   totalAmount: number;
//   status: string;
//   createdAt: string;
// }


export interface Order {
  id: string;
  customerName: string;
  date: string;
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
}
