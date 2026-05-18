import { AuthPageContainer } from "@/components/auth/AuthPageContainer";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return <AuthPageContainer />;
}
