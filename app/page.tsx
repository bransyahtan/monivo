"use client";

import { AuthLoading } from "@/components/auth/AuthLoading";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <AuthLoading />
    </div>
  );
}
