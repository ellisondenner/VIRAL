import { AbsoluteFill, Still } from "remotion";
import { config } from "./config";
import { Fundo } from "./Fundo";
import type { ReelProps } from "./tipos";

const tamanhoCapa = (t: string) => (t.length <= 30 ? 132 : t.length <= 55 ? 112 : 96);

export const Capa: React.FC<ReelProps> = ({ roteiro }) => {
  const { cores, fontes, margem } = config;
  return (
    <AbsoluteFill>
      <Fundo />
      <AbsoluteFill
        style={{
          paddingLeft: margem.lateral,
          paddingRight: margem.lateral,
          // A grade do perfil corta a capa em 3:4 no centro; mantenha o título no meio.
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 140,
            height: 14,
            borderRadius: 7,
            backgroundColor: cores.destaque,
            marginBottom: 56,
          }}
        />
        <div
          style={{
            fontFamily: fontes.titulo.familia,
            fontWeight: Number(fontes.titulo.peso),
            fontSize: tamanhoCapa(roteiro.titulo_capa),
            lineHeight: 1.1,
            letterSpacing: -1.5,
            color: cores.texto,
            textWrap: "balance",
          }}
        >
          {roteiro.titulo_capa}
        </div>
        {config.assinatura ? (
          <div
            style={{
              marginTop: 64,
              fontFamily: fontes.corpo.familia,
              fontWeight: Number(fontes.corpo.peso),
              fontSize: 44,
              color: cores.textoSuave,
            }}
          >
            {config.assinatura}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CapaStill: React.FC = () => (
  <Still
    id="Capa"
    component={Capa}
    width={1080}
    height={1920}
    defaultProps={{
      roteiro: {
        id: "exemplo",
        titulo_capa: "Título de exemplo para a capa",
        legenda: "",
        cenas: [{ tipo: "gancho", texto: "Gancho", duracao: 3 }],
      },
    }}
  />
);
