import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Composition,
  Series,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CenaView } from "./CenaView";
import { config } from "./config";
import { Fundo } from "./Fundo";
import type { ReelProps } from "./tipos";

const framesDaCena = (segundos: number, fps: number) => Math.max(1, Math.round(segundos * fps));

// A duração do vídeo é sempre a soma das durações das cenas do roteiro.
const calculateMetadata: CalculateMetadataFunction<ReelProps> = ({ props }) => {
  const fps = config.video.fps;
  return {
    fps,
    width: config.video.largura,
    height: config.video.altura,
    durationInFrames: props.roteiro.cenas.reduce((t, c) => t + framesDaCena(c.duracao, fps), 0),
  };
};

const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: `${((frame + 1) / durationInFrames) * 100}%`,
        backgroundColor: config.cores.barraProgresso,
      }}
    />
  );
};

const Assinatura: React.FC = () =>
  config.assinatura ? (
    <div
      style={{
        position: "absolute",
        left: config.margem.lateral,
        right: config.margem.lateral,
        bottom: config.margem.base - 120,
        fontFamily: config.fontes.corpo.familia,
        fontWeight: Number(config.fontes.corpo.peso),
        fontSize: 40,
        color: config.cores.textoSuave,
        opacity: 0.8,
      }}
    >
      {config.assinatura}
    </div>
  ) : null;

export const Reel: React.FC<ReelProps> = ({ roteiro }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Fundo />
      <Series>
        {roteiro.cenas.map((cena, i) => (
          <Series.Sequence
            key={i}
            name={`${i + 1}. ${cena.tipo}`}
            durationInFrames={framesDaCena(cena.duracao, fps)}
            premountFor={fps}
          >
            <CenaView cena={cena} />
          </Series.Sequence>
        ))}
      </Series>
      <Assinatura />
      <BarraProgresso />
    </AbsoluteFill>
  );
};

export const ReelComposition: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    // Valores reais vêm do calculateMetadata (soma das cenas).
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
    calculateMetadata={calculateMetadata}
    defaultProps={{
      roteiro: {
        id: "exemplo",
        titulo_capa: "Título de exemplo para a capa",
        legenda: "Legenda de exemplo.",
        cenas: [
          { tipo: "gancho", texto: "Um gancho forte nos primeiros segundos.", duracao: 3 },
          {
            tipo: "desenvolvimento",
            texto: "Uma ideia por cena",
            apoio: "Texto de apoio curto, que dá para ler sem pausar.",
            duracao: 4,
          },
          { tipo: "chamada", texto: "Salve para ver depois", duracao: 3 },
        ],
      },
    }}
  />
);
