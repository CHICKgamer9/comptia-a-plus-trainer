import { handleCreateProfile, handleListProfiles } from "@/lib/account/api";

export async function GET() {
  return handleListProfiles();
}

export async function POST(request: Request) {
  return handleCreateProfile(request);
}
