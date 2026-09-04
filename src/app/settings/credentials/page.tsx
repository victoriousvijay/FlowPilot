import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CredentialsForm } from "@/components/credentials-form";

export default async function CredentialsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: credentials } = await supabase
    .from("credentials")
    .select("integration, display_name, updated_at")
    .eq("user_id", user.id);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Connections</h1>
      <p className="mt-2 text-muted">
        Connect only the accounts your automations need. Secrets are encrypted at rest and never
        exposed to the browser.
      </p>
      <div className="mt-8">
        <CredentialsForm existing={credentials ?? []} />
      </div>
    </div>
  );
}
