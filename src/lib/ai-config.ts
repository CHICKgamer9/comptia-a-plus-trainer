export const DEFAULT_AI_MODEL = "openai/gpt-5.4";

export function aiConfigured() {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.OPENAI_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}
