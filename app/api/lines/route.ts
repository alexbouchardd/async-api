import { getAllLog } from "@/services/asyncapi";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const structuredUrl = new URL(request.url);
  const logLines = await getAllLog(
    9,
    structuredUrl.searchParams.get("prev") || undefined
  );
  return NextResponse.json({
    logLines,
  });
};
