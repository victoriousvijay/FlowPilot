import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";
import { saveCredential } from "@/lib/credentials";

const RequestSchema = z.object({
  integration: z.enum(["google_sheets", "slack", "gmail"]),
  displayName: z.string().min(1).max(100),
  secret: z.string().min(1).max(4000),
});

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("credentials")
    .select("integration, display_name, updated_at")
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to load credentials" }, { status: 500 });
  }
  return NextResponse.json({ credentials: data });
}

export async function POST(request: Request) {
  const { user, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    await saveCredential(user.id, parsed.data.integration, parsed.data.displayName, parsed.data.secret);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save credential", err);
    return NextResponse.json({ error: "Failed to save credential" }, { status: 500 });
  }
}
