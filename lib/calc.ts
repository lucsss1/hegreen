import type { Resultado } from "./types";

type NumLike = number | string | null | undefined;

const n = (v: NumLike): number => {
  if (v === null || v === undefined || v === "") return NaN;
  return typeof v === "number" ? v : parseFloat(v);
};

export function calcEV(pSua: NumLike, odd: NumLike): number | null {
  const pf = n(pSua) / 100;
  const of = n(odd);
  if (!pf || !of || pf <= 0 || pf >= 1 || of <= 0) return null;
  return (pf * of - 1) * 100;
}

export function calcPMkt(odd: NumLike, oddC: NumLike): number | null {
  const o1 = n(odd);
  const o2 = n(oddC);
  if (!o1 || !o2 || o1 <= 0 || o2 <= 0) return null;
  return (1 / o1 / (1 / o1 + 1 / o2)) * 100;
}

export function stakeFrom(ev: number | null): { u: number; l: string } {
  if (ev === null || ev < 5) return { u: 0, l: "—" };
  if (ev < 10) return { u: 1, l: "1u" };
  if (ev < 15) return { u: 2, l: "2u" };
  return { u: 3, l: "3u" };
}

export function evCls(ev: number | null): "" | "neg" | "warn" | "pos" {
  if (ev === null) return "";
  if (ev < 0) return "neg";
  if (ev < 5) return "warn";
  return "pos";
}

export function resCol(r: Resultado): string {
  return r === "ganhou"
    ? "var(--win)"
    : r === "perdeu"
    ? "var(--lose)"
    : r === "void"
    ? "var(--ink4)"
    : "var(--warn)";
}

export function resLbl(r: Resultado): string {
  return r === "ganhou"
    ? "✓ Ganhou"
    : r === "perdeu"
    ? "✕ Perdeu"
    : r === "void"
    ? "⊘ Void"
    : "⏳ Pendente";
}

export function fmt(v: number | null | undefined, d = 2): string {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return v.toFixed(d);
}

export function fmtR(v: number | null | undefined): string {
  if (v === null || v === undefined || isNaN(v)) return "—";
  return (v >= 0 ? "+" : "") + `R$ ${Math.abs(v).toFixed(2)}`;
}

export function fmtBRL(v: number): string {
  return `R$ ${v.toFixed(2).replace(".", ",")}`;
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
