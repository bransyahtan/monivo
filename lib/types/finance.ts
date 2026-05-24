export type TransactionType = "income" | "expense" | "transfer";

export interface Category {
  id: number;
  name: string;
  slug?: string;
}

export interface Account {
  id: number;
  account_name: string;
  balance: number;
  bank_name?: string;
  bank_type?: string;
}

export interface Bank {
  id: number;
  name: string;
  slug: string;
  type: "bank" | "e-wallet" | "cash";
}

export interface TransactionData {
  id: number | string;
  user_id?: number;
  type: TransactionType;
  amount: number;
  category_id?: number | null;
  category_name?: string;
  from_account_id?: number | null;
  from_account_name?: string;
  to_account_id?: number | null;
  to_account_name?: string;
  account_name?: string;
  description?: string | null;
  transaction_date: string | Date;
  created_at?: string | Date;
  updated_at?: string | Date;
}
