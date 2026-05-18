"use client";

import Link from "next/link";
import { DeleteBankButton } from "@/components/admin/DeleteBankButton";

export interface Bank {
  id: number;
  name: string;
  type: string;
  created_at: Date;
}

interface BanksTabProps {
  banks: Bank[];
  currentPage: number;
}

export const BanksTab = ({ banks, currentPage }: BanksTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            Registered Asset Sources
          </h2>
          <p className="text-xs text-text-secondary">
            Configure institutional sources, gateways, and cash storage options.
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
            No configured bank sources found. Click the button above to register one.
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
                    {new Date(bank.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
                        name={bank.name}
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
  );
};
