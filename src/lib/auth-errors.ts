export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("unsupported provider") || lower.includes("provider is not enabled")) {
    return "Google sign-in isn't set up yet on this workspace. Use email and password instead, or ask the site owner to enable it.";
  }
  if (lower.includes("rate limit")) {
    return "Too many attempts in a short time. Please wait a few minutes and try again.";
  }
  if (lower.includes("already registered") || lower.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  return message;
}
