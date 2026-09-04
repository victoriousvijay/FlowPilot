import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateAutomation } from "@/components/create-automation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-sm font-medium text-accent">AI-first automation</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Describe it. We automate it.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Turn a plain-language instruction into a validated, visual, executable workflow —
          no nodes to learn, no code to write.
        </p>
        <div className="mt-8">
          <Link href="/login">
            <Button size="md">Get started</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <CreateAutomation />;
}
