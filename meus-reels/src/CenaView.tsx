import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { config } from "./config";
import { tamanhoApoio, tamanhoTitulo } from "./tamanhoTexto";
import type { Cena } from "./tipos";

export const CenaView: React.FC<{ readonly cena: Cena }> = ({ cena }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { cores, fontes, margem } = config;

  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const entradaApoio = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const saida = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ehChamada = cena.tipo === "chamada";
  const ehGancho = cena.tipo === "gancho";

  const titulo = (
    <div
      style={{
        fontFamily: fontes.titulo.familia,
        fontWeight: Number(fontes.titulo.peso),
        fontSize: tamanhoTitulo(cena.texto),
        lineHeight: 1.12,
        letterSpacing: -1,
        color: ehChamada ? cores.chamadaTexto : ehGancho ? cores.destaque : cores.texto,
        textWrap: "balance",
      }}
    >
      {cena.texto}
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        paddingLeft: margem.lateral,
        paddingRight: margem.lateral,
        paddingTop: margem.topo,
        paddingBottom: margem.base,
        justifyContent: "center",
        opacity: saida,
      }}
    >
      <div
        style={{
          opacity: entrada,
          transform: `translateY(${interpolate(entrada, [0, 1], [60, 0])}px)`,
          ...(ehChamada
            ? {
                backgroundColor: cores.chamadaFundo,
                borderRadius: 40,
                padding: "64px 56px",
              }
            : null),
        }}
      >
        {titulo}
      </div>
      {cena.apoio ? (
        <div
          style={{
            marginTop: 48,
            opacity: entradaApoio,
            transform: `translateY(${interpolate(entradaApoio, [0, 1], [40, 0])}px)`,
            fontFamily: fontes.corpo.familia,
            fontWeight: Number(fontes.corpo.peso),
            fontSize: tamanhoApoio(cena.apoio),
            lineHeight: 1.35,
            color: cores.textoSuave,
            textWrap: "pretty",
          }}
        >
          {cena.apoio}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
