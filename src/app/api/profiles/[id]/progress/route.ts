import { handleGetProfileProgress, handlePutProfileProgress } from "@/lib/account/api";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handleGetProfileProgress(id);
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return handlePutProfileProgress(id, request);
}
