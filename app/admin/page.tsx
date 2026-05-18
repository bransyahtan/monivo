import { AddBankForm } from "@/components/admin/AddBankForm";
import { DeleteBankButton } from "@/components/admin/DeleteBankButton";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { EditUserForm } from "@/components/admin/EditUserForm";
import { ToggleActivationButton } from "@/components/admin/ToggleActivationButton";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    edit?: string;
    addBank?: string;
    editUser?: string;
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
  let bankToEdit: { id: number; name: string; type: string } | null = null;
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
  let userToEdit: { id: number; name: string; role: string } | null = null;
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

  let banks: { id: number; name: string; type: string; created_at: Date }[] =
    [];
  let users: {
    id: number;
    name: string;
    username: string;
    email: string | null;
    phone_number: string | null;
    role: string;
    is_active: boolean;
    created_at: Date;
  }[] = [];
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
  const showUserModal = !!userToEdit;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl space-y-6">
        <div className="w-full p-6 rounded-xl bg-surface border border-white/5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Admin Portal
            </h1>
            <p className="text-text-secondary text-xs mt-0.5">
              Configure system institutions and global payment gateway sources.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/5 border border-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all duration-200 text-xs font-semibold cursor-pointer rounded-lg"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="flex border-b border-white/5 gap-2">
          <Link
            href="?tab=banks"
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 ${
              tab === "banks"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            Asset Sources
          </Link>
          <Link
            href="?tab=users"
            className={`px-4 py-2 text-xs font-bold transition-all border-b-2 ${
              tab === "users"
                ? "border-primary text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            User Management
          </Link>
        </div>

        <div className="p-6 rounded-xl bg-surface border border-white/5 flex flex-col justify-between min-h-[420px]">
          {tab === "banks" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">
                    Registered Asset Sources
                  </h2>
                  <p className="text-xs text-text-secondary">
                    Configure institutional sources, gateways, and cash storage
                    options.
                  </p>
                </div>
                <Link
                  href="?tab=banks&addBank=true"
                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all text-xs cursor-pointer"
                >
                  + Add Asset Source
                </Link>
              </div>

              {banks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-lg">
                  <p className="text-text-secondary text-xs">
                    No configured bank sources found. Click the button above to
                    register one.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                        <th className="pb-3 w-16 text-center">No</th>
                        <th className="pb-3 pl-3">Name</th>
                        <th className="pb-3 w-28">Type</th>
                        <th className="pb-3 w-36">Date Configured</th>
                        <th className="pb-3 w-28 text-right pr-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {banks.map((bank) => (
                        <tr
                          key={bank.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 text-center text-text-secondary font-mono">
                            {bank.id}
                          </td>
                          <td className="py-3 pl-3 font-semibold text-text-primary">
                            {bank.name}
                          </td>
                          <td className="py-3 text-text-secondary font-medium capitalize">
                            {bank.type}
                          </td>
                          <td className="py-3 text-text-secondary">
                            {new Date(bank.created_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-3 text-right pr-3">
                            <div className="flex justify-end items-center gap-3">
                              <Link
                                href={`?tab=banks&page=${currentPage}&edit=${bank.id}`}
                                className="text-primary hover:text-primary-light font-semibold transition-colors"
                              >
                                Edit
                              </Link>
                              <span className="text-white/10">|</span>
                              <DeleteBankButton
                                id={Number(bank.id)}
                                name={bank.name as string}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary tracking-tight">
                  User Directory
                </h2>
                <p className="text-xs text-text-secondary">
                  Manage registered profiles, adjust role access, and toggle
                  system login active state.
                </p>
              </div>

              {users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-lg">
                  <p className="text-text-secondary text-xs">
                    No users registered in the system.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-xs font-bold text-text-secondary uppercase tracking-wider">
                        <th className="pb-3 w-16 text-center">ID</th>
                        <th className="pb-3 pl-3">Profile Name</th>
                        <th className="pb-3">Username / Email</th>
                        <th className="pb-3 w-24">Role</th>
                        <th className="pb-3 w-28 text-center">Status</th>
                        <th className="pb-3 w-36">Created At</th>
                        <th className="pb-3 w-28 text-right pr-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 text-center text-text-secondary font-mono">
                            {user.id}
                          </td>
                          <td className="py-3 pl-3">
                            <div className="font-semibold text-text-primary">
                              {user.name}
                            </div>
                            {user.phone_number && (
                              <div className="text-[10px] text-text-secondary mt-0.5">
                                {user.phone_number}
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="text-text-primary font-medium">
                              {user.username}
                            </div>
                            <div className="text-[10px] text-text-secondary mt-0.5">
                              {user.email}
                            </div>
                          </td>
                          <td className="py-3 font-semibold capitalize text-text-primary">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                user.role === "admin"
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <ToggleActivationButton
                              userId={Number(user.id)}
                              isActive={!!user.is_active}
                            />
                          </td>
                          <td className="py-3 text-text-secondary">
                            {new Date(user.created_at).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="py-3 text-right pr-3">
                            <div className="flex justify-end items-center gap-3">
                              <Link
                                href={`?tab=users&page=${currentPage}&editUser=${user.id}`}
                                className="text-primary hover:text-primary-light font-semibold transition-colors"
                              >
                                Edit
                              </Link>
                              <span className="text-white/10">|</span>
                              <DeleteUserButton
                                id={Number(user.id)}
                                name={user.name as string}
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 mt-4 gap-4">
              <div className="text-xs text-text-secondary">
                Showing{" "}
                <span className="font-semibold text-text-primary">
                  {offset + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-text-primary">
                  {Math.min(
                    offset + (tab === "banks" ? banks.length : users.length),
                    totalRecords,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-text-primary">
                  {totalRecords}
                </span>{" "}
                records
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Link
                  href={`?tab=${tab}&page=${currentPage > 1 ? currentPage - 1 : 1}`}
                  aria-disabled={currentPage <= 1}
                  className={`p-2 rounded-lg border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all flex items-center justify-center ${
                    currentPage <= 1 ? "opacity-30 pointer-events-none" : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center px-3.5 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-text-primary">
                  Page {currentPage} of {totalPages}
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

        {/* Modal Backdrop Container for Banks Form */}
        {showBankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg shadow-2xl relative">
              <AddBankForm bankToEdit={bankToEdit} />
            </div>
          </div>
        )}

        {/* Modal Backdrop Container for Users Form */}
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
