import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const res = NextResponse.redirect(`${base}/`);
  res.cookies.set("ig_token", "", { path: "/", maxAge: 0 });
  return res;
}
