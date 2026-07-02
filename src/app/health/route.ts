import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    service: "old-school-shuffle",
    status: "ok"
  });
}
