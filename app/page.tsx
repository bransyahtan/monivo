import HomeClient from "@/components/HomeClient";
import { getSession } from "@/lib/auth";

export default async function Home() {
  const session = await getSession();

  return <HomeClient session={session} />;
}
