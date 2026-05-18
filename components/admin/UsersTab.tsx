"use client";

import Link from "next/link";
import { ToggleActivationButton } from "@/components/admin/ToggleActivationButton";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";

interface User {
  id: number;
  name: string;
  username: string;
  email: string | null;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  created_at: Date;
}

interface UsersTabProps {
  users: User[];
  currentPage: number;
}

export const UsersTab = ({ users, currentPage }: UsersTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-text-primary tracking-tight">
          User Directory
        </h2>
        <p className="text-xs text-text-secondary">
          Manage registered profiles, adjust role access, and toggle system login active state.
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
                    {user.email && (
                      <div className="text-[10px] text-text-secondary mt-0.5">
                        {user.email}
                      </div>
                    )}
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
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
                        name={user.name}
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
