import { AddBankForm } from "@/components/admin/AddBankForm";
import { DeleteBankButton } from "@/components/admin/DeleteBankButton";
import { getSession } from "@/lib/auth";
import { sql } from "@/lib/db";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ page?: string; edit?: string }>;
}

export default async function AdminPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 5;
  const offset = (currentPage - 1) * limit;
  const editId = params.edit ? Number(params.edit) : null;

  const session = await getSession();

  if (!session) {
    redirect("/auth");
  }

  if (session.role !== "admin") {
    redirect("/");
  }

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

  const banks = await sql`
    SELECT id, name, type, created_at
    FROM banks
    ORDER BY id ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [countResult] = await sql`
    SELECT COUNT(*) as count FROM banks
  `;
  const totalBanks = Number(countResult.count);
  const totalPages = Math.ceil(totalBanks / limit) || 1;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-start p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl space-y-6">
        
        {/* Header Panel */}
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

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Asset Form */}
          <div className="lg:col-span-4">
            <AddBankForm bankToEdit={bankToEdit} />
          </div>

          {/* Right Column: Asset Sources Table */}
          <div className="lg:col-span-8 p-6 rounded-xl bg-surface border border-white/5 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-text-primary tracking-tight">
                  Registered Asset Sources
                </h2>
                <p className="text-xs text-text-secondary">
                  System-configured financial institutions, e-wallets, and cash accounts.
                </p>
              </div>

              {banks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-lg">
                  <p className="text-text-secondary text-xs">
                    No configured bank sources found. Add one on the left.
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
                        <tr key={bank.id} className="hover:bg-white/5 transition-colors">
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
                            {new Date(bank.created_at).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-3 text-right pr-3">
                            <div className="flex justify-end items-center gap-3">
                              <Link
                                href={`?page=${currentPage}&edit=${bank.id}`}
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

            {/* Pagination Panel */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-4 mt-4 gap-4">
                <div className="text-xs text-text-secondary">
                  Showing <span className="font-semibold text-text-primary">{offset + 1}</span> to{" "}
                  <span className="font-semibold text-text-primary">
                    {Math.min(offset + banks.length, totalBanks)}
                  </span>{" "}
                  of <span className="font-semibold text-text-primary">{totalBanks}</span> records
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <Link
                    href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
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
                    href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
                    aria-disabled={currentPage >= totalPages}
                    className={`p-2 rounded-lg border border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all flex items-center justify-center ${
                      currentPage >= totalPages ? "opacity-30 pointer-events-none" : ""
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
