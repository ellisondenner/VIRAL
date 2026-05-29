import { NextResponse } from "next/server";
import { getAuthorizationUrl } from "../../../../lib/instagram";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.INSTAGRAM_APP_ID || !process.env.INSTAGRAM_APP_SECRET) {
    // Sem credenciais configuradas: manda para o app com aviso.
    const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
    return NextResponse.redirect(`${base}/?erro=sem_credenciais`);
  }
  const state = Math.random().toString(36).slice(2);
  return NextResponse.redirect(getAuthorizationUrl(state));
}
