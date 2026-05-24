import { sql } from "@/lib/db";
import { TransactionData, TransactionFilters } from "@/types/finance";

export async function fetchTransactions(
  userId: number,
  filters: TransactionFilters = {},
) {
  const { limit = 20, page = 1, accountId } = filters;
  const offset = (page - 1) * limit;

  const accountFilter = accountId
    ? sql`AND (t.from_account_id = ${Number(accountId)} OR t.to_account_id = ${Number(accountId)})`
    : sql``;

  const [countResult] = await sql`
    SELECT COUNT(*) as total 
    FROM transactions t
    WHERE t.user_id = ${userId}
    ${accountFilter}
  `;

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
    WHERE t.user_id = ${userId}
    ${accountFilter}
    ORDER BY t.transaction_date DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    data: transactions,
    total: Number(countResult.total),
  };
}

export async function fetchTransfers(
  userId: number,
  filters: TransactionFilters = {},
) {
  const { limit = 20, page = 1 } = filters;
  const offset = (page - 1) * limit;

  const [countResult] = await sql`
    SELECT COUNT(*) as total 
    FROM transactions t
    WHERE t.user_id = ${userId} AND t.type = 'transfer'
  `;

  const transactions = await sql<TransactionData[]>`
    SELECT 
      t.*, 
      af.account_name as from_account_name,
      at.account_name as to_account_name
    FROM transactions t
    JOIN accounts af ON t.from_account_id = af.id
    JOIN accounts at ON t.to_account_id = at.id
    WHERE t.user_id = ${userId} AND t.type = 'transfer'
    ORDER BY t.transaction_date DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return {
    data: transactions,
    total: Number(countResult.total),
  };
}

export async function createTransaction(
  userId: number,
  data: Omit<
    TransactionData,
    | "id"
    | "user_id"
    | "category_name"
    | "from_account_name"
    | "to_account_name"
    | "account_name"
  >,
) {
  const {
    type,
    amount,
    category_id,
    from_account_id,
    to_account_id,
    description,
    transaction_date,
  } = data;

  return await sql.begin(async (sql) => {
    // 0. Verify Account Ownership (Security Fix: Prevent IDOR)
    if (from_account_id) {
      const [fromAccountExists] = await sql`
        SELECT id FROM accounts WHERE id = ${from_account_id} AND user_id = ${userId}
      `;
      if (!fromAccountExists) {
        throw new Error("Unauthorized account access (Source)");
      }
    }

    if (to_account_id) {
      const [toAccountExists] = await sql`
        SELECT id FROM accounts WHERE id = ${to_account_id} AND user_id = ${userId}
      `;
      if (!toAccountExists) {
        throw new Error("Unauthorized account access (Destination)");
      }
    }

    // 1. Insert Transaction
    const [transaction] = await sql`
      INSERT INTO transactions (
        user_id, type, amount, category_id, from_account_id, to_account_id, description, transaction_date
      ) VALUES (
        ${userId}, 
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
        WHERE id = ${from_account_id} AND user_id = ${userId}
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
        WHERE id = ${from_account_id} AND user_id = ${userId}
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
        WHERE id = ${from_account_id} AND user_id = ${userId}
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
        WHERE id = ${to_account_id} AND user_id = ${userId}
        RETURNING balance
      `;
      await sql`
        INSERT INTO account_balance_history (account_id, transaction_id, amount_change, balance_after)
        VALUES (${to_account_id}, ${transaction.id}, ${amount}, ${toAccount.balance})
      `;
    }

    return transaction;
  });
}
