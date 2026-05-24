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
        af.account_name as from_account_name,
        at.account_name as to_account_name,
        COALESCE(af.account_name, at.account_name) as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts af ON t.from_account_id = af.id
      LEFT JOIN accounts at ON t.to_account_id = at.id
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

export async function getTransfers(
  limit: number = 20,
): Promise<TransactionData[]> {
  const session = await getSession();
  if (!session) return [];
  try {
    const transactions = await sql<TransactionData[]>`
      SELECT 
        t.*, 
        af.account_name as from_account_name,
        at.account_name as to_account_name
      FROM transactions t
      JOIN accounts af ON t.from_account_id = af.id
      JOIN accounts at ON t.to_account_id = at.id
      WHERE t.user_id = ${session.userId} AND t.type = 'transfer'
      ORDER BY t.transaction_date DESC
      LIMIT ${limit}
    `;
    return transactions;
  } catch (error) {
    console.error("GetTransfers Error:", error);
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
    to_account_id: formData.get("to_account_id") || null,
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
    to_account_id,
    description,
    transaction_date,
  } = validated.data;

  try {
    await sql.begin(async (sql) => {
      // 1. Insert Transaction
      const [transaction] = await sql`
        INSERT INTO transactions (
          user_id, type, amount, category_id, from_account_id, to_account_id, description, transaction_date
        ) VALUES (
          ${session.userId}, 
          ${type}, 
          ${amount}, 
          ${category_id ?? null}, 
          ${from_account_id ?? null},
          ${to_account_id ?? null},
          ${description ?? null}, 
          ${transaction_date ?? new Date().toISOString()}
        )
        RETURNING id
      `;

      // 2. Update Balances and Record History
      if (type === "expense" && from_account_id) {
        const [account] = await sql`
          UPDATE accounts 
          SET balance = balance - ${amount} 
          WHERE id = ${from_account_id} AND user_id = ${session.userId}
          RETURNING balance
        `;
        await sql`
          INSERT INTO account_balance_history (account_id, transaction_id, amount_change, balance_after)
          VALUES (${from_account_id}, ${transaction.id}, ${-amount}, ${account.balance})
        `;
      } else if (type === "income" && from_account_id) {
        const [account] = await sql`
          UPDATE accounts 
          SET balance = balance + ${amount} 
          WHERE id = ${from_account_id} AND user_id = ${session.userId}
          RETURNING balance
        `;
        await sql`
          INSERT INTO account_balance_history (account_id, transaction_id, amount_change, balance_after)
          VALUES (${from_account_id}, ${transaction.id}, ${amount}, ${account.balance})
        `;
      } else if (type === "transfer" && from_account_id && to_account_id) {
        // Source Account (Decrease)
        const [fromAccount] = await sql`
          UPDATE accounts 
          SET balance = balance - ${amount} 
          WHERE id = ${from_account_id} AND user_id = ${session.userId}
          RETURNING balance
        `;
        await sql`
          INSERT INTO account_balance_history (account_id, transaction_id, amount_change, balance_after)
          VALUES (${from_account_id}, ${transaction.id}, ${-amount}, ${fromAccount.balance})
        `;

        // Destination Account (Increase)
        const [toAccount] = await sql`
          UPDATE accounts 
          SET balance = balance + ${amount} 
          WHERE id = ${to_account_id} AND user_id = ${session.userId}
          RETURNING balance
        `;
        await sql`
          INSERT INTO account_balance_history (account_id, transaction_id, amount_change, balance_after)
          VALUES (${to_account_id}, ${transaction.id}, ${amount}, ${toAccount.balance})
        `;
      }
    });

    revalidatePath("/transactions");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");
    return { success: true, message: "Transaction recorded successfully." };
  } catch (error) {
    console.error("AddTransaction Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
