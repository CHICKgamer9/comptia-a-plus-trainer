import { handleMigrateGuest } from "@/lib/account/api";

export async function POST(request: Request) {
  return handleMigrateGuest(request);
}
