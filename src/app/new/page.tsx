import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateAutomation } from "@/components/create-automation";

export default async function NewAutomationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/new");

  return <CreateAutomation />;
}
