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

export async function getAccountById(id: string | number) {
  const session = await getSession();
  if (!session) return null;

  try {
    const [account] = await sql`
      SELECT a.*, b.name as bank_name, b.type as bank_type
      FROM accounts a 
      JOIN banks b ON a.bank_id = b.id 
      WHERE a.id = ${Number(id)} AND a.user_id = ${session.userId}
    `;
    return account;
  } catch (error) {
    console.error("GetAccountById Error:", error);
    return null;
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
export async function getBalanceHistory(
  startDate?: string,
  endDate?: string,
  accountId?: string | number,
) {
  const session = await getSession();
  if (!session) return [];

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date();
  if (!startDate) start.setMonth(start.getMonth() - 1);

  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  const userId = Number(session.userId);

  try {
    const [{ current_total }] = await sql`
      SELECT COALESCE(SUM(balance), 0) as current_total 
      FROM accounts 
      WHERE user_id = ${userId}
      ${accountId ? sql`AND id = ${Number(accountId)}` : sql``}
    `;

    // 2. Get movements from End Date to NOW (to find Balance at End Date)
    const [{ movements_since_end }] = await sql`
      SELECT COALESCE(SUM(amount_change), 0) as movements_since_end
      FROM account_balance_history h
      JOIN accounts a ON h.account_id = a.id
      WHERE a.user_id = ${userId} 
        AND h.created_at > ${end.toISOString()}
        ${accountId ? sql`AND a.id = ${Number(accountId)}` : sql``}
    `;

    const balanceAtEnd = Number(current_total) - Number(movements_since_end);

    const dailyMovements = await sql`
      SELECT 
        (h.created_at AT TIME ZONE 'UTC')::date as move_date,
        SUM(h.amount_change) as daily_sum
      FROM account_balance_history h
      JOIN accounts a ON h.account_id = a.id
      WHERE a.user_id = ${userId} 
        AND h.created_at <= ${end.toISOString()}
        AND h.created_at >= ${start.toISOString()}
        ${accountId ? sql`AND a.id = ${Number(accountId)}` : sql``}
      GROUP BY move_date
      ORDER BY move_date DESC
    `;

    const series = [];
    let runningBalance = balanceAtEnd;
    const movementMap = new Map(
      dailyMovements.map((m) => {
        const dateKey =
          typeof m.move_date === "string"
            ? m.move_date.split("T")[0]
            : m.move_date.toISOString().split("T")[0];
        return [dateKey, Number(m.daily_sum)];
      }),
    );

    const currentPtr = new Date(end);
    currentPtr.setHours(0, 0, 0, 0);

    const startLimit = new Date(start);
    startLimit.setHours(0, 0, 0, 0);

    while (currentPtr >= startLimit) {
      const dateStr = currentPtr.toISOString().split("T")[0];
      series.push({
        name: currentPtr.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        value: runningBalance,
        rawDate: dateStr,
      });

      const daySum = movementMap.get(dateStr) || 0;
      runningBalance -= daySum;

      currentPtr.setDate(currentPtr.getDate() - 1);
    }

    return series.reverse();
  } catch (error) {
    console.error("GetBalanceHistory Error:", error);
    return [];
  }
}

export async function getCategoryData(
  startDate?: string,
  endDate?: string,
  accountId?: string | number,
) {
  const session = await getSession();
  if (!session) return { income: [], expense: [] };

  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : new Date();
  if (!startDate) start.setMonth(start.getMonth() - 1);

  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  const userId = Number(session.userId);

  try {
    const results = await sql`
      SELECT 
        c.name as category_name,
        t.type,
        t.from_account_id,
        t.to_account_id,
        SUM(t.amount) as total
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ${userId}
        AND t.transaction_date >= ${start.toISOString()}
        AND t.transaction_date <= ${end.toISOString()}
        ${
          accountId
            ? sql`AND (t.from_account_id = ${Number(accountId)} OR t.to_account_id = ${Number(accountId)})`
            : sql`AND t.type != 'transfer'`
        }
      GROUP BY c.name, t.type, t.from_account_id, t.to_account_id
    `;

    const income: { name: string; value: number }[] = [];
    const expense: { name: string; value: number }[] = [];

    results.forEach((row) => {
      let name = row.category_name || "Internal Transfer";
      let value = Number(row.total);

      if (accountId) {
        const id = Number(accountId);
        if (row.type === "transfer") {
          if (Number(row.from_account_id) === id) {
            expense.push({ name: "Transfer Out", value });
          } else if (Number(row.to_account_id) === id) {
            income.push({ name: "Transfer In", value });
          }
        } else {
          if (row.type === "income") income.push({ name, value });
          else if (row.type === "expense") expense.push({ name, value });
        }
      } else {
        if (row.type === "income") income.push({ name, value });
        else if (row.type === "expense") expense.push({ name, value });
      }
    });

    return { income, expense };
  } catch (error) {
    console.error("GetCategoryData Error:", error);
    return { income: [], expense: [] };
  }
}
