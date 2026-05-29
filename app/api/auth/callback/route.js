import { NextResponse } from "next/server";
import { exchangeCodeForToken, exchangeForLongLivedToken } from "../../../../lib/instagram";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${base}/?erro=login_cancelado`);
  }

  try {
    const short = await exchangeCodeForToken(code);
    const long = await exchangeForLongLivedToken(short.access_token);
    const token = long.access_token || short.access_token;

    const res = NextResponse.redirect(`${base}/dashboard`);
    res.cookies.set("ig_token", token, {
      httpOnly: true,
      secure: base.startsWith("https"),
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 50 // ~50 dias
    });
    return res;
  } catch (e) {
    return NextResponse.redirect(`${base}/?erro=falha_token`);
  }
}
