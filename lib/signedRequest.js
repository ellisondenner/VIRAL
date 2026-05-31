// Validação do "signed_request" que a Meta envia nos callbacks de
// desautorização e exclusão de dados.
// Formato: <base64url(assinatura)>.<base64url(payload)>
import crypto from "crypto";

function base64UrlDecode(input) {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

export function parseSignedRequest(signedRequest, appSecret) {
  if (!signedRequest || !signedRequest.includes(".")) return null;
  const [encodedSig, payload] = signedRequest.split(".", 2);

  const expectedSig = crypto
    .createHmac("sha256", appSecret || "")
    .update(payload)
    .digest();
  const providedSig = base64UrlDecode(encodedSig);

  if (
    expectedSig.length !== providedSig.length ||
    !crypto.timingSafeEqual(expectedSig, providedSig)
  ) {
    return null; // assinatura inválida
  }

  try {
    return JSON.parse(base64UrlDecode(payload).toString("utf8"));
  } catch {
    return null;
  }
}
