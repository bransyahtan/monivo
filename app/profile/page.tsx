import { getProfile } from "@/app/actions/user";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import { getSession } from "@/lib/auth";
import { Calendar, KeyRound, Shield, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/auth");

  const profile = await getProfile();
  if (!profile) redirect("/auth");

  const joinedDate = new Date(profile.created_at).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const initials = (profile.name as string)
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-text-primary tracking-tight uppercase">
            Profile
          </h1>
          <p className="text-text-secondary text-xs md:text-base max-w-2xl leading-relaxed">
            Manage your personal identity and account security credentials.
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="relative p-8 rounded-4xl bg-surface/30 border border-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl shadow-primary/5">
              <span className="text-2xl font-black text-primary tracking-tight">
                {initials}
              </span>
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center ${profile.role === "admin" ? "bg-yellow-500" : "bg-primary"}`}
            >
              <Shield className="w-2.5 h-2.5 text-background" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <h2 className="text-2xl font-black text-text-primary tracking-tight">
              {profile.name}
            </h2>
            <p className="text-sm text-text-secondary font-bold">
              @{profile.username}
            </p>
            <p className="text-xs text-text-secondary">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <span
                className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${profile.role === "admin" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-primary/10 border-primary/20 text-primary"}`}
              >
                {profile.role}
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                <Calendar className="w-3 h-3" />
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
            <User className="w-3.5 h-3.5" />
            Identity Registry
          </h2>
        </div>
        <ProfileEditForm profile={profile} />
      </div>

      {/* Change Password Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5" />
            Security Credentials
          </h2>
        </div>
        <PasswordChangeForm />
      </div>
    </div>
  );
}
