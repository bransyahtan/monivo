import { AddBankForm } from "@/components/admin/AddBankForm";
import { AddCategoryForm } from "@/components/admin/AddCategoryForm";
import { BanksTab } from "@/components/admin/BanksTab";
import { CategoriesTab } from "@/components/admin/CategoriesTab";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { UsersTab } from "@/components/admin/UsersTab";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { Bank, Category } from "@/types/finance";
import { AdminUser } from "@/types/user";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    edit?: string;
    addBank?: string;
    editUser?: string;
    addCategory?: string;
    editCategory?: string;
    tab?: string;
  }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab || "banks";
  const currentPage = Number(params.page) || 1;
  const limit = 5;
  const offset = (currentPage - 1) * limit;

  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

  const editId = params.edit ? Number(params.edit) : null;
  let bankToEdit = null;
  if (editId) {
    const [bank] = await sql`
      SELECT id, name, type FROM banks WHERE id = ${editId}
    `;
    if (bank) {
      bankToEdit = {
        id: Number(bank.id),
        name: bank.name as string,
        type: bank.type as string,
      };
    }
  }

  const editUserId = params.editUser ? Number(params.editUser) : null;
  let userToEdit = null;
  if (editUserId) {
    const [user] = await sql`
      SELECT id, name, role FROM users WHERE id = ${editUserId}
    `;
    if (user) {
      userToEdit = {
        id: Number(user.id),
        name: user.name as string,
        role: user.role as string,
      };
    }
  }

  const editCategoryId = params.editCategory
    ? Number(params.editCategory)
    : null;
  let categoryToEdit = null;
  if (editCategoryId) {
    const [category] = await sql`
      SELECT id, name, slug FROM categories WHERE id = ${editCategoryId}
    `;
    if (category) {
      categoryToEdit = {
        id: Number(category.id),
        name: category.name as string,
        slug: category.slug as string,
      };
    }
  }

  let banks: Bank[] = [];
  let categories: Category[] = [];
  let users: AdminUser[] = [];
  let totalRecords = 0;

  if (tab === "banks") {
    banks = await sql`
      SELECT id, name, type, created_at
      FROM banks
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [countResult] = await sql`
      SELECT COUNT(*) as count FROM banks
    `;
    totalRecords = Number(countResult.count);
  } else if (tab === "categories") {
    categories = await sql`
      SELECT id, name, slug, created_at
      FROM categories
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [countResult] = await sql`
      SELECT COUNT(*) as count FROM categories
    `;
    totalRecords = Number(countResult.count);
  } else {
    users = await sql`
      SELECT id, name, username, email, phone_number, role, is_active, created_at
      FROM users
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const [countResult] = await sql`
      SELECT COUNT(*) as count FROM users
    `;
    totalRecords = Number(countResult.count);
  }

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  const showBankModal = params.addBank === "true" || !!bankToEdit;
  const showCategoryModal = params.addCategory === "true" || !!categoryToEdit;
  const showUserModal = !!userToEdit;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-2 sm:p-4 md:p-8 font-sans overflow-x-hidden">
      <div className="w-full max-w-6xl space-y-6">
        <div className="w-full p-4 sm:p-6 rounded-xl bg-surface border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
              Admin Portal
            </h1>
            <p className="text-text-secondary text-[10px] sm:text-xs mt-0.5">
              Configure system institutions and global payment gateway sources.
            </p>
          </div>
          <Link
            href="/"
            className="w-full sm:w-auto text-center px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-200 text-xs font-semibold cursor-pointer rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="flex border-b border-white/5 gap-4 overflow-x-auto scrollbar-none pb-px">
          <Link
            href="?tab=banks"
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              tab === "banks"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Asset Sources
          </Link>
          <Link
            href="?tab=categories"
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              tab === "categories"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Categories
          </Link>
          <Link
            href="?tab=users"
            className={`px-3 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
              tab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            User Management
          </Link>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-surface border border-white/5 flex flex-col justify-between min-h-[420px] overflow-hidden">
          <div className="w-full">
            {tab === "banks" && (
              <BanksTab banks={banks} currentPage={currentPage} />
            )}
            {tab === "categories" && (
              <CategoriesTab
                categories={categories}
                currentPage={currentPage}
              />
            )}
            {tab === "users" && (
              <UsersTab users={users} currentPage={currentPage} />
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-6 mt-6 gap-4">
              <div className="text-[10px] sm:text-xs text-text-secondary">
                Showing{" "}
                <span className="font-semibold text-text-primary">
                  {offset + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-text-primary">
                  {Math.min(
                    offset +
                      (tab === "banks"
                        ? banks.length
                        : tab === "categories"
                          ? categories.length
                          : users.length),
                    totalRecords,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-text-primary">
                  {totalRecords}
                </span>{" "}
                records
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <Link
                  href={`?tab=${tab}&page=${currentPage > 1 ? currentPage - 1 : 1}`}
                  aria-disabled={currentPage <= 1}
                  className={`p-2 rounded-lg border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all flex items-center justify-center ${
                    currentPage <= 1 ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center px-4 rounded-lg bg-white/5 border border-white/5 text-[10px] sm:text-xs font-bold text-text-primary">
                  {currentPage} / {totalPages}
                </div>
                <Link
                  href={`?tab=${tab}&page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                  aria-disabled={currentPage >= totalPages}
                  className={`p-2 rounded-lg border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all flex items-center justify-center ${
                    currentPage >= totalPages
                      ? "opacity-30 pointer-events-none"
                      : ""
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {showBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg shadow-2xl relative">
              <AddBankForm bankToEdit={bankToEdit} />
            </div>
          </div>
        )}

        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md shadow-2xl relative">
              <AddCategoryForm categoryToEdit={categoryToEdit} />
            </div>
          </div>
        )}

        {showUserModal && userToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md shadow-2xl relative">
              <EditUserForm userToEdit={userToEdit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
