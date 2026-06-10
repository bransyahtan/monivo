"use server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import * as TransactionService from "@/lib/services/transaction.service";
import { transactionSchema } from "@/lib/validations/transaction";
import type { ActionState } from "@/types/api";
import { TransactionData } from "@/types/finance";
import { revalidatePath } from "next/cache";

export async function getTransactions(
  limit: number = 20,
  accountId?: string | number,
  page: number = 1,
  excludeTransfers: boolean = false,
): Promise<{ data: TransactionData[]; total: number }> {
  const session = await getSession();
  if (!session) return { data: [], total: 0 };

  try {
    return await TransactionService.fetchTransactions(Number(session.userId), {
      limit,
      page,
      accountId,
      excludeTransfers,
    });
  } catch (error) {
    console.error("GetTransactions Action Error:", error);
    return { data: [], total: 0 };
  }
}

export async function getTransfers(
  limit: number = 20,
  page: number = 1,
): Promise<{ data: TransactionData[]; total: number }> {
  const session = await getSession();
  if (!session) return { data: [], total: 0 };

  try {
    return await TransactionService.fetchTransfers(Number(session.userId), {
      limit,
      page,
    });
  } catch (error) {
    console.error("GetTransfers Action Error:", error);
    return { data: [], total: 0 };
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
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
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

  try {
    if (validated.data.type === "transfer") {
      const { from_account_id, to_account_id, amount } = validated.data;

      if (
        from_account_id &&
        to_account_id &&
        String(from_account_id) === String(to_account_id)
      ) {
        return {
          success: false,
          message: "Source and destination accounts must be different.",
        };
      }

      if (from_account_id) {
        const [sourceAccount] = await sql`
          SELECT balance FROM accounts 
          WHERE id = ${from_account_id} AND user_id = ${Number(session.userId)}
        `;
        if (sourceAccount && Number(sourceAccount.balance) < Number(amount)) {
          return {
            success: false,
            message: `Insufficient balance. Available: Rp ${new Intl.NumberFormat("id-ID").format(Number(sourceAccount.balance))}.`,
          };
        }
      }
    }

    await TransactionService.createTransaction(
      Number(session.userId),
      validated.data,
    );

    revalidatePath("/transactions");
    revalidatePath("/transfers");
    revalidatePath("/accounts");
    revalidatePath("/dashboard");

    return { success: true, message: "Transaction recorded successfully." };
  } catch (error) {
    console.error("AddTransaction Action Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
