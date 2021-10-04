export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    token?: string;
    balance: number;
    type_id: number;
  }