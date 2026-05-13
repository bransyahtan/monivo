import { NoAuthSection } from "@/components/auth/NoAuthSection";
import { getSession } from "@/lib/auth";
import { User, ShieldCheck, LogOut, ShieldAlert } from "lucide-react";
import { logoutUser } from "@/app/actions/auth";

export default async function Home() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
        <NoAuthSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-8 rounded-3xl bg-surface/50 border border-white/10 backdrop-blur-xl space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 relative">
            <User className="w-10 h-10 text-primary" />
            {session.role === 'admin' && (
              <div className="absolute -top-1 -right-1 bg-amber-500 p-1.5 rounded-full border-2 border-surface">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-text-primary tracking-tight">
              Welcome back, {session.name}!
            </h1>
            <div className="flex items-center justify-center gap-2 text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Logged in as @{session.username}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">User ID</p>
            <p className="text-lg text-text-primary font-mono">{session.userId}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Role</p>
            <p className={`text-lg font-bold capitalize ${session.role === 'admin' ? 'text-amber-500' : 'text-primary'}`}>
              {session.role}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Username</p>
            <p className="text-lg text-text-primary">@{session.username}</p>
          </div>
        </div>

        <form action={logoutUser}>
          <button 
            type="submit"
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-text-secondary hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all duration-300 flex items-center justify-center gap-2 font-medium cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
