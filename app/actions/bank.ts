"use server";

import { sql } from "@/lib/db";
import { slugify } from "@/lib/utils/slug";
import { bankSchema } from "@/lib/validations/bank";
import { revalidatePath } from "next/cache";

export type AddBankState = {
  success?: boolean;
  message?: string;
  errors?: {
    name?: string[];
    type?: string[];
  };
};

export type EditBankState = AddBankState;

let isDbMigrated = false;
async function ensureSlugColumn() {
  if (isDbMigrated) return;
  try {
    await sql`
      ALTER TABLE banks ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
    `;
    const existing = await sql`
      SELECT id, name FROM banks WHERE slug IS NULL
    `;

    for (const row of existing) {
      let generatedSlug = slugify(row.name);
      const [duplicate] = await sql`
        SELECT id FROM banks WHERE slug = ${generatedSlug} LIMIT 1
      `;
      if (duplicate) {
        generatedSlug = `${generatedSlug}-${row.id}`;
      }

      await sql`
        UPDATE banks SET slug = ${generatedSlug} WHERE id = ${row.id}
      `;
    }

    try {
      await sql`
        ALTER TABLE banks ADD CONSTRAINT banks_slug_unique UNIQUE (slug);
      `;
    } catch {}

    await sql`
      ALTER TABLE banks ALTER COLUMN slug SET NOT NULL;
    `;

    isDbMigrated = true;
  } catch (error) {
    console.warn(
      "⚠️ Migration: Error checking or adding slug column in database",
      error,
    );
  }
}

export async function addBank(
  prevState: AddBankState,
  formData: FormData,
): Promise<AddBankState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = bankSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten()
        .fieldErrors as AddBankState["errors"],
      message: "Please check your input and try again.",
    };
  }

  const { name, type } = validatedFields.data;
  const slug = slugify(name);

  try {
    await ensureSlugColumn();

    const [existing] = await sql`
      SELECT id, name FROM banks 
      WHERE slug = ${slug}
      LIMIT 1
    `;

    if (existing) {
      return {
        success: false,
        message: `An asset source with a similar name already exists ("${existing.name}").`,
      };
    }

    await sql`
      INSERT INTO banks (name, slug, type)
      VALUES (${name}, ${slug}, ${type})
    `;
    revalidatePath("/admin");
    return { success: true, message: "Bank successfully added!" };
  } catch (error) {
    console.error("Error adding bank:", error);
    return { success: false, message: "Failed to add bank to database." };
  }
}
export async function updateBank(
  bankId: number,
  prevState: EditBankState,
  formData: FormData,
): Promise<EditBankState> {
  const rawData = Object.fromEntries(formData.entries());
  const validatedFields = bankSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten()
        .fieldErrors as EditBankState["errors"],
      message: "Please check your input and try again.",
    };
  }

  const { name, type } = validatedFields.data;
  const slug = slugify(name);

  try {
    await ensureSlugColumn();

    const [existing] = await sql`
      SELECT id, name FROM banks 
      WHERE slug = ${slug} AND id <> ${bankId}
      LIMIT 1
    `;

    if (existing) {
      return {
        success: false,
        message: `Another asset source named "${existing.name}" already exists.`,
      };
    }

    await sql`
      UPDATE banks 
      SET name = ${name}, slug = ${slug}, type = ${type}, updated_at = NOW()
      WHERE id = ${bankId}
    `;
    revalidatePath("/admin");
    return { success: true, message: "Bank successfully updated!" };
  } catch (error) {
    console.error("Error updating bank:", error);
    return { success: false, message: "Failed to update bank." };
  }
}

export async function deleteBank(formData: FormData): Promise<void> {
  const id = Number(formData.get("id"));
  if (!id) return;

  try {
    await sql`
      DELETE FROM banks WHERE id = ${id}
    `;
    revalidatePath("/admin");
  } catch (error) {
    console.error("Error deleting bank:", error);
  }
}
