export type Cena = {
  readonly tipo: "gancho" | "desenvolvimento" | "chamada";
  readonly texto: string;
  readonly apoio?: string;
  /** Duração em segundos. */
  readonly duracao: number;
};

export type Roteiro = {
  readonly id: string;
  readonly titulo_capa: string;
  readonly legenda: string;
  readonly cenas: readonly Cena[];
};

export type ReelProps = {
  readonly roteiro: Roteiro;
};
