import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export async function getCredentialSecret(
  userId: string,
  integration: string
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("credentials")
    .select("encrypted_secret")
    .eq("user_id", userId)
    .eq("integration", integration)
    .maybeSingle();

  if (error || !data) return null;
  return decryptSecret(data.encrypted_secret as string);
}

export async function saveCredential(
  userId: string,
  integration: string,
  displayName: string,
  secret: string
) {
  const supabase = createAdminClient();
  const encrypted_secret = encryptSecret(secret);
  const { error } = await supabase.from("credentials").upsert(
    {
      user_id: userId,
      integration,
      display_name: displayName,
      encrypted_secret,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,integration" }
  );
  if (error) throw new Error(error.message);
}
