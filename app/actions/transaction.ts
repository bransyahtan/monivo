"use server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { transactionSchema } from "@/lib/validations/transaction";
import { revalidatePath } from "next/cache";

import { TransactionData } from "@/lib/types/finance";

export interface TransactionState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function getTransactions(
  limit: number = 20,
): Promise<TransactionData[]> {
  const session = await getSession();
  if (!session) return [];

  try {
    const transactions = await sql<TransactionData[]>`
      SELECT 
        t.*, 
        c.name as category_name,
        a.account_name as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.from_account_id = a.id
      WHERE t.user_id = ${session.userId}
      ORDER BY t.transaction_date DESC
      LIMIT ${limit}
    `;
    return transactions;
  } catch (error) {
    console.error("GetTransactions Error:", error);
    return [];
  }
}

export async function getCategories() {
  try {
    const categories = await sql`SELECT * FROM categories ORDER BY name ASC`;
    return categories;
  } catch (error) {
    console.error("GetCategories Error:", error);
    return [];
  }
}

export async function addTransaction(
  prevState: TransactionState,
  formData: FormData,
): Promise<TransactionState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized action." };
  }

  const rawData = {
    type: formData.get("type"),
    amount: formData.get("amount"),
    category_id: formData.get("category_id") || null,
    from_account_id: formData.get("from_account_id") || null,
    description: formData.get("description"),
    transaction_date:
      formData.get("transaction_date") || new Date().toISOString(),
  };

  const validated = transactionSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the form errors.",
    };
  }

  const {
    type,
    amount,
    category_id,
    from_account_id,
    description,
    transaction_date,
  } = validated.data;

  try {
    await sql`
      INSERT INTO transactions (
        user_id, type, amount, category_id, from_account_id, description, transaction_date
      ) VALUES (
        ${session.userId}, 
        ${type}, 
        ${amount}, 
        ${category_id ?? null}, 
        ${from_account_id ?? null},
        ${description ?? null}, 
        ${transaction_date ?? new Date().toISOString()}
      )
    `;

    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: true, message: "Transaction recorded successfully." };
  } catch (error) {
    console.error("AddTransaction Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
