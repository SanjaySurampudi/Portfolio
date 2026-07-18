import { redirect } from "next/navigation";
import { hasAdminAction } from "@/app/actions";
import { getSessionUser } from "@/lib/auth";
import SetupForm from "./SetupForm";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  // If an admin already exists, this page is locked — send to login
  const adminExists = await hasAdminAction();
  if (adminExists) {
    redirect("/admin/login");
  }

  // If somehow already logged in, go straight to the dashboard
  const adminUser = await getSessionUser();
  if (adminUser) {
    redirect("/admin");
  }

  return <SetupForm />;
}