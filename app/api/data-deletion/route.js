import { NextResponse } from "next/server";
import crypto from "crypto";
import { parseSignedRequest } from "../../../lib/signedRequest";

export const dynamic = "force-dynamic";

// Endpoint de "solicitação de exclusão de dados" exigido pela Meta.
// A Meta envia um signed_request; devemos iniciar a exclusão e responder
// com { url, confirmation_code }.
// Como não guardamos dados do usuário no servidor, a exclusão é imediata.
export async function POST(request) {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  let userId = "desconhecido";

  try {
    const form = await request.formData();
    const data = parseSignedRequest(form.get("signed_request"), process.env.INSTAGRAM_APP_SECRET);
    if (data && data.user_id) userId = String(data.user_id);
  } catch {
    // segue com userId desconhecido
  }

  const confirmationCode = crypto.randomBytes(8).toString("hex");
  const statusUrl = `${base}/exclusao-de-dados?code=${confirmationCode}&uid=${encodeURIComponent(userId)}`;

  return NextResponse.json({ url: statusUrl, confirmation_code: confirmationCode });
}
