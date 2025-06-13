export interface User {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    status: "active" | "inactive" | "blocked";
    phone: string;
  }
  