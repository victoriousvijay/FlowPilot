import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing — FlowPilot" };

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For trying out AI-generated automations.",
    features: ["Unlimited workflow generation", "Up to 3 active workflows", "Basic execution history"],
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For individuals and small teams running automations in production.",
    features: [
      "Unlimited active workflows",
      "Full execution history",
      "Priority AI generation",
      "Email support",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Simple pricing</h1>
        <p className="mt-2 text-muted">Start free. Upgrade when your automations go to production.</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div key={plan.name} className="flex flex-col rounded-lg border border-border p-6">
            <div className="font-medium">{plan.name}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold">{plan.price}</span>
              <span className="text-sm text-muted">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{plan.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {plan.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <div className="mt-6">
              <Link href="/signup">
                <Button className="w-full" variant={plan.name === "Pro" ? "primary" : "secondary"}>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
