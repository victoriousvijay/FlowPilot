import { createClient } from "@/lib/supabase/server";
import { INTEGRATION_LABELS } from "@/integrations/registry-data";
import { LandingHero, LandingSteps, LandingIntegrations, LandingCTA } from "@/components/landing";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/signup";
  const primaryLabel = user ? "Go to dashboard" : "Get started free";

  return (
    <div className="flex-1">
      <LandingHero primaryHref={primaryHref} primaryLabel={primaryLabel} loggedIn={!!user} />
      <LandingSteps />
      <LandingIntegrations labels={Object.values(INTEGRATION_LABELS)} />
      <LandingCTA primaryHref={primaryHref} primaryLabel={primaryLabel} />
    </div>
  );
}
