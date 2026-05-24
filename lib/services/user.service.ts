import { sql } from "@/lib/db";
import { UserProfile } from "@/types/user";

export async function fetchProfile(
  userId: number,
): Promise<UserProfile | null> {
  try {
    const users = await sql<UserProfile[]>`
      SELECT id, name, username, email, phone_number, role, created_at
      FROM users
      WHERE id = ${userId}
    `;
    return users[0] || null;
  } catch (error) {
    console.error("fetchProfile error:", error);
    return null;
  }
}

export async function updateUserActivation(
  userId: number,
  nextStatus: boolean,
  activatedAt: Date | null,
) {
  return await sql`
    UPDATE users 
    SET is_active = ${nextStatus}, activated_at = ${activatedAt}
    WHERE id = ${userId}
  `;
}

export async function updateBasicInfo(
  userId: number,
  data: { name: string; role?: string },
) {
  const { name, role } = data;
  if (role) {
    return await sql`
      UPDATE users
      SET name = ${name}, role = ${role}
      WHERE id = ${userId}
    `;
  }
  return await sql`
    UPDATE users
    SET name = ${name}
    WHERE id = ${userId}
  `;
}

export async function deleteUser(userId: number) {
  return await sql`
    DELETE FROM users WHERE id = ${userId}
  `;
}

export async function checkConflict(
  userId: number,
  username: string,
  email: string,
) {
  return await sql`
    SELECT username, email FROM users
    WHERE (username = ${username} OR email = ${email})
      AND id != ${userId}
    LIMIT 1
  `;
}

export async function updateFullProfile(
  userId: number,
  data: Partial<UserProfile>,
) {
  const { name, username, email, phone_number } = data;
  return await sql`
    UPDATE users
    SET name = ${name || ""}, 
        username = ${username || ""}, 
        email = ${email || ""}, 
        phone_number = ${phone_number || null}
    WHERE id = ${userId}
  `;
}

export async function updatePassword(userId: number, hashed: string) {
  return await sql`UPDATE users SET password = ${hashed} WHERE id = ${userId}`;
}
