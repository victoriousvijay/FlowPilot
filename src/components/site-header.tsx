import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          FlowPilot
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/settings/credentials" className="hover:text-foreground">
                Connections
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/about" className="hidden hover:text-foreground sm:inline">
                About
              </Link>
              <Link href="/pricing" className="hidden hover:text-foreground sm:inline">
                Pricing
              </Link>
              <Link href="/signin" className="hover:text-foreground">
                Sign in
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up for free</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
