import { handleGetAccount } from "@/lib/account/api";

export async function GET() {
  return handleGetAccount();
}
