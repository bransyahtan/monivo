"use server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { accountSchema } from "@/lib/validations/account";
import { revalidatePath } from "next/cache";

export interface AccountState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function getAccounts() {
  const session = await getSession();
  if (!session) return [];

  try {
    const accounts = await sql`
      SELECT a.*, b.name as bank_name, b.type as bank_type
      FROM accounts a 
      JOIN banks b ON a.bank_id = b.id 
      WHERE a.user_id = ${session.userId} 
      ORDER BY a.account_name ASC
    `;
    return accounts;
  } catch (error) {
    console.error("GetAccounts Error:", error);
    return [];
  }
}

export async function getBanks() {
  try {
    const banks = await sql`SELECT * FROM banks ORDER BY type ASC, name ASC`;
    return banks;
  } catch (error) {
    console.error("GetBanks Error:", error);
    return [];
  }
}

export async function addAccount(
  prevState: AccountState,
  formData: FormData,
): Promise<AccountState> {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized action." };
  }

  const rawData = {
    bank_id: formData.get("bank_id"),
    account_name: formData.get("account_name"),
    balance: formData.get("balance"),
  };

  const validated = accountSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the form errors.",
    };
  }

  const { bank_id, account_name, balance } = validated.data;

  try {
    await sql`
      INSERT INTO accounts (
        user_id, bank_id, account_name, balance
      ) VALUES (
        ${session.userId}, 
        ${bank_id}, 
        ${account_name}, 
        ${balance}
      )
    `;

    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("AddAccount Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
