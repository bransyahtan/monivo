import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export default async function AuthPage() {
  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return <AuthPageContainer />;
}
