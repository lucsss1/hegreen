export type Resultado = "pendente" | "ganhou" | "perdeu" | "void";

export interface Aposta {
  id: number;
  data: string;
  liga: string;
  jogo: string;
  mercado: string;
  multipla: boolean;
  selecoes: string | null;
  odd: number;
  pMkt: number | null;
  ajustes: string | null;
  psua: number;
  ev: number | null;
  stakeU: number;
  stakeR: number;
  notas: string | null;
  resultado: Resultado;
  oddFech: number | null;
  lucro: number | null;
}

export interface ApostaRow {
  id: number;
  data: string;
  liga: string;
  jogo: string;
  mercado: string;
  multipla: boolean;
  selecoes: string | null;
  odd: number;
  p_mkt: number | null;
  ajustes: string | null;
  psua: number;
  ev: number | null;
  stake_u: number;
  stake_r: number;
  notas: string | null;
  resultado: Resultado;
  odd_fech: number | null;
  lucro: number | null;
}

export function toDB(b: Aposta): ApostaRow {
  return {
    id: b.id,
    data: b.data,
    liga: b.liga,
    jogo: b.jogo,
    mercado: b.mercado,
    multipla: b.multipla || false,
    selecoes: b.selecoes || null,
    odd: b.odd,
    p_mkt: b.pMkt ?? null,
    ajustes: b.ajustes || null,
    psua: b.psua,
    ev: b.ev,
    stake_u: b.stakeU,
    stake_r: b.stakeR,
    notas: b.notas || null,
    resultado: b.resultado,
    odd_fech: b.oddFech ?? null,
    lucro: b.lucro ?? null,
  };
}

export function fromDB(r: ApostaRow): Aposta {
  return {
    id: r.id,
    data: r.data,
    liga: r.liga,
    jogo: r.jogo,
    mercado: r.mercado,
    multipla: r.multipla,
    selecoes: r.selecoes,
    odd: r.odd,
    pMkt: r.p_mkt,
    ajustes: r.ajustes,
    psua: r.psua,
    ev: r.ev,
    stakeU: r.stake_u,
    stakeR: r.stake_r,
    notas: r.notas,
    resultado: r.resultado,
    oddFech: r.odd_fech,
    lucro: r.lucro,
  };
}
