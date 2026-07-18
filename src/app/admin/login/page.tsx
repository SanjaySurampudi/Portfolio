import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  // If already logged in, skip the form and go straight to the dashboard
  const adminUser = await getSessionUser();
  if (adminUser) {
    redirect("/admin");
  }

  return <LoginForm />;
}