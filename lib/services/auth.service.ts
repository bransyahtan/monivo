import { sql } from "@/lib/db";
import { UserCreateData } from "@/types/user";

export async function findUserByIdentifier(identifier: string) {
  return await sql`
    SELECT id, name, username, password, role, is_active FROM users 
    WHERE username = ${identifier} OR email = ${identifier} 
    LIMIT 1
  `;
}

export async function checkRegistrationConflicts(
  username: string,
  email: string,
  phone_number?: string | null,
) {
  return await sql`
    SELECT username, email, phone_number FROM users 
    WHERE username = ${username} 
    OR email = ${email} 
    OR (phone_number IS NOT NULL AND phone_number = ${phone_number || ""})
    LIMIT 1
  `;
}

export async function createUser(data: UserCreateData) {
  const { name, username, email, hashedPassword, phone_number } = data;
  return await sql`
    INSERT INTO users (name, username, email, password, phone_number)
    VALUES (${name}, ${username}, ${email}, ${hashedPassword}, ${phone_number || null})
  `;
}
