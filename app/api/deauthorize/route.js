import { NextResponse } from "next/server";
import { parseSignedRequest } from "../../../lib/signedRequest";

export const dynamic = "force-dynamic";

// A Meta chama este endpoint quando o usuário remove o app do Instagram.
// Como NÃO armazenamos nenhum dado do usuário no servidor (o token fica
// apenas em um cookie no navegador do próprio usuário), não há o que apagar.
// Apenas confirmamos o recebimento.
export async function POST(request) {
  try {
    const form = await request.formData();
    const signed = form.get("signed_request");
    parseSignedRequest(signed, process.env.INSTAGRAM_APP_SECRET);
  } catch {
    // ignora corpo malformado
  }
  return NextResponse.json({ success: true });
}
