import { handleDeleteProfile, handleGetProfile, handleUpdateProfile } from "@/lib/account/api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleGetProfile(id);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleUpdateProfile(id, request);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleDeleteProfile(id);
}
