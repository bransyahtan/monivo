"use client";

import { logoutUser } from "@/app/actions/auth";
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  ShieldCheck,
  User,
  Wallet,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarLayoutProps {
  children: React.ReactNode;
  session: {
    name: string;
    username: string;
    role: string;
    email?: string | null;
  } | null;
}

export const SidebarLayout = ({ children, session }: SidebarLayoutProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isExcluded =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin");

  if (isExcluded) {
    return <>{children}</>;
  }

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Account", href: "/accounts", icon: Wallet },
    { name: "Transfer", href: "/transfers", icon: ArrowLeftRight },
    { name: "Transaction", href: "/transactions", icon: ReceiptText },
  ];

  if (session?.role === "admin") {
    menuItems.push({
      name: "Admin Center",
      href: "/admin",
      icon: ShieldCheck,
    });
  }

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row text-text-primary">
      <aside className="hidden md:flex flex-col w-64 bg-surface border border-border p-6 rounded-2xl m-6 h-[calc(100vh-3rem)] sticky top-6 justify-between shadow-xl">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <Image
              src="/images/logo_monivo.png"
              alt="Monivo Logo"
              width={130}
              height={40}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-background shadow-md shadow-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4.5 h-4.5 ${isActive ? "text-background" : "text-primary"}`}
                    />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <Link
            href="/profile"
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              pathname === "/profile"
                ? "bg-primary text-background shadow-md shadow-primary/10"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <User
                className={`w-4.5 h-4.5 ${pathname === "/profile" ? "text-background" : "text-primary"}`}
              />
              Profile
            </div>
          </Link>

          {session && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-border">
              <div className="max-w-[150px] overflow-hidden">
                <span className="text-[12px] font-semibold text-text-primary block truncate">
                  {session.name}
                </span>
                <span className="text-[10px] text-text-secondary uppercase tracking-tight block font-medium mt-0.5">
                  {session.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="md:hidden sticky top-4 z-40 px-4">
        <div className="flex items-center gap-4 px-5 py-3.5 bg-surface border border-border backdrop-blur-xl rounded-xl shadow-lg">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5 text-text-primary transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5 text-primary" />
          </button>
          <Image
            src="/images/logo_monivo.png"
            alt="Monivo Logo"
            width={110}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed top-4 bottom-4 left-4 z-50 flex flex-col w-72 max-w-[calc(100vw-2rem)] bg-surface border border-border p-6 h-[calc(100vh-2rem)] justify-between rounded-2xl shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Image
              src="/images/logo_monivo.png"
              alt="Monivo Logo"
              width={120}
              height={36}
              priority
              className="h-8 w-auto object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-background shadow-md shadow-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4.5 h-4.5 ${isActive ? "text-background" : "text-primary"}`}
                    />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
              pathname === "/profile"
                ? "bg-primary text-background shadow-md shadow-primary/10"
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <User
                className={`w-4.5 h-4.5 ${pathname === "/profile" ? "text-background" : "text-primary"}`}
              />
              Profile
            </div>
          </Link>

          {session && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-border">
              <div className="max-w-[150px] overflow-hidden">
                <span className="text-[12px] font-semibold text-text-primary block truncate">
                  {session.name}
                </span>
                <span className="text-[10px] text-text-secondary uppercase tracking-tight block font-medium mt-0.5">
                  {session.role}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="p-1.5 rounded-md hover:bg-red-500/10 text-text-secondary hover:text-red-400 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 md:pl-4 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
