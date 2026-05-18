"use server";

import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { categorySchema } from "@/lib/validations/category";
import { revalidatePath } from "next/cache";

export interface CategoryState {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function addCategory(
  prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  const rawName = formData.get("name") as string;
  const rawSlug = formData.get("slug") as string;

  const validated = categorySchema.safeParse({ name: rawName, slug: rawSlug });
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the form errors.",
    };
  }

  const { name, slug } = validated.data;

  try {
    const duplicate = await sql`
      SELECT name, slug FROM categories 
      WHERE name = ${name} OR slug = ${slug} 
      LIMIT 1
    `;

    if (duplicate.length > 0) {
      const match = duplicate[0];
      if (match.name === name) {
        return { success: false, message: "A category with this name already exists." };
      }
      if (match.slug === slug) {
        return { success: false, message: "A category with this slug already exists." };
      }
    }

    await sql`
      INSERT INTO categories (name, slug)
      VALUES (${name}, ${slug})
    `;

    revalidatePath("/admin");
    return { success: true, message: "Category added successfully." };
  } catch (error) {
    console.error("AddCategory Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function updateCategory(
  id: number,
  prevState: CategoryState,
  formData: FormData,
): Promise<CategoryState> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  const rawName = formData.get("name") as string;
  const rawSlug = formData.get("slug") as string;

  const validated = categorySchema.safeParse({ name: rawName, slug: rawSlug });
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Please correct the form errors.",
    };
  }

  const { name, slug } = validated.data;

  try {
    const duplicate = await sql`
      SELECT name, slug FROM categories 
      WHERE (name = ${name} OR slug = ${slug}) AND id != ${id} 
      LIMIT 1
    `;

    if (duplicate.length > 0) {
      const match = duplicate[0];
      if (match.name === name) {
        return { success: false, message: "Another category with this name already exists." };
      }
      if (match.slug === slug) {
        return { success: false, message: "Another category with this slug already exists." };
      }
    }

    await sql`
      UPDATE categories
      SET name = ${name}, slug = ${slug}, updated_at = NOW()
      WHERE id = ${id}
    `;

    revalidatePath("/admin");
    return { success: true, message: "Category updated successfully." };
  } catch (error) {
    console.error("UpdateCategory Error:", error);
    return { success: false, message: "A database error occurred." };
  }
}

export async function deleteCategory(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Unauthorized action." };
  }

  const id = Number(formData.get("id"));

  try {
    await sql`
      DELETE FROM categories WHERE id = ${id}
    `;
    revalidatePath("/admin");
    return { success: true, message: "Category deleted successfully." };
  } catch (error) {
    console.error("DeleteCategory Error:", error);
    return { success: false, message: "Failed to delete category." };
  }
}
