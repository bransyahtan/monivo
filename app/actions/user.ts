"use server";

import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleUserActivation(userId: number, currentStatus: boolean) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  try {
    const nextStatus = !currentStatus;
    const activatedAt = nextStatus ? new Date() : null;

    await sql`
      UPDATE users 
      SET is_active = ${nextStatus}, activated_at = ${activatedAt}
      WHERE id = ${userId}
    `;

    revalidatePath("/admin");
    return { success: true, message: `User successfully ${nextStatus ? "activated" : "deactivated"}` };
  } catch (error) {
    console.error("toggleUserActivation error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function updateUser(userId: number, prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  const name = formData.get("name")?.toString().trim();
  const role = formData.get("role")?.toString().trim();

  if (!name) {
    return { success: false, message: "Name is required." };
  }

  if (role !== "admin" && role !== "customer") {
    return { success: false, message: "Invalid role selected." };
  }

  try {
    await sql`
      UPDATE users
      SET name = ${name}, role = ${role}
      WHERE id = ${userId}
    `;

    revalidatePath("/admin");
    return { success: true, message: "User updated successfully." };
  } catch (error) {
    console.error("updateUser error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function deleteUser(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  const userId = Number(formData.get("id"));

  if (!userId) {
    return { success: false, message: "User ID is required." };
  }

  try {
    await sql`
      DELETE FROM users WHERE id = ${userId}
    `;

    revalidatePath("/admin");
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
