import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchProfile, fetchMedia } from "../../../lib/instagram";
import { analyzeProfile } from "../../../lib/analysis";
import { sampleProfile, sampleMedia } from "../../../lib/sampleData";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const demo = searchParams.get("demo") === "1";

  // Modo demonstração: usa dados fictícios.
  if (demo) {
    const result = analyzeProfile(sampleProfile, sampleMedia);
    return NextResponse.json({ demo: true, ...result });
  }

  const token = cookies().get("ig_token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Conta não conectada. Faça login com o Instagram ou use o modo demonstração." },
      { status: 401 }
    );
  }

  try {
    const [profile, media] = await Promise.all([
      fetchProfile(token),
      fetchMedia(token, 25)
    ]);
    const result = analyzeProfile(profile, media);
    return NextResponse.json({ demo: false, ...result });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Erro ao analisar a conta. Tente reconectar." },
      { status: 500 }
    );
  }
}
