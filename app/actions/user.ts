"use server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import * as UserService from "@/lib/services/user.service";
import type { ActionState } from "@/types/api";
import { UserProfile } from "@/types/user";
import { SignJWT } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export type ProfileState = ActionState;

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret",
);

export async function toggleUserActivation(
  userId: number,
  currentStatus: boolean,
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  try {
    const nextStatus = !currentStatus;
    const activatedAt = nextStatus ? new Date() : null;

    await UserService.updateUserActivation(userId, nextStatus, activatedAt);

    revalidatePath("/admin");
    return {
      success: true,
      message: `User successfully ${nextStatus ? "activated" : "deactivated"}`,
    };
  } catch (error) {
    console.error("toggleUserActivation error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function updateUser(
  userId: number,
  prevState: ActionState,
  formData: FormData,
) {
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
    await UserService.updateBasicInfo(userId, { name, role });

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
    await UserService.deleteUser(userId);

    revalidatePath("/admin");
    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    console.error("deleteUser error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function getProfile(): Promise<UserProfile | null> {
  const session = await getSession();
  if (!session) return null;

  return await UserService.fetchProfile(Number(session.userId));
}

export async function updateProfile(
  prevState: ActionState,
  formData: FormData,
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const name = formData.get("name")?.toString().trim();
  const username = formData.get("username")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone_number = formData.get("phone_number")?.toString().trim() || null;

  if (!name || !username || !email) {
    return {
      success: false,
      message: "Name, username, and email are required.",
    };
  }

  const userId = Number(session.userId);

  try {
    const conflicts = await UserService.checkConflict(userId, username, email);

    if (conflicts.length > 0) {
      if (conflicts[0].username === username)
        return { success: false, message: "This username is already taken." };
      if (conflicts[0].email === email)
        return { success: false, message: "This email is already registered." };
    }

    await UserService.updateFullProfile(userId, {
      name,
      username,
      email,
      phone_number,
    });

    // Refresh Session Cookie
    const token = await new SignJWT({
      userId: session.userId,
      username: username,
      name: name,
      role: session.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    revalidatePath("/profile");
    revalidatePath("/", "layout");
    return { success: true, message: "Profile updated successfully." };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function updatePassword(
  prevState: ActionState,
  formData: FormData,
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Unauthorized." };

  const currentPassword = formData.get("current_password")?.toString();
  const newPassword = formData.get("new_password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All password fields are required." };
  }
  if (newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters.",
    };
  }
  if (newPassword !== confirmPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  const userId = Number(session.userId);

  try {
    const [user] = await sql`SELECT password FROM users WHERE id = ${userId}`;
    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid)
      return { success: false, message: "Current password is incorrect." };

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserService.updatePassword(userId, hashed);

    return { success: true, message: "Password updated successfully." };
  } catch (error) {
    console.error("updatePassword error:", error);
    return { success: false, message: "A database error occurred." };
  }
}
