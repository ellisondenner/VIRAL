import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { config } from "./config";

const carregar = (f: { familia: string; arquivo: string; peso: string }) =>
  loadFont({ family: f.familia, url: staticFile(f.arquivo), weight: f.peso });

export const fontesCarregadas = Promise.all([
  carregar(config.fontes.titulo),
  carregar(config.fontes.corpo),
]);
