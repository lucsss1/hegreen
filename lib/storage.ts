import type { Aposta } from "./types";

const BANCA_KEY = "banca_v7";
const BETS_OFFLINE_KEY = "bets_off";

export function getBanca(): number {
  if (typeof window === "undefined") return 100;
  return parseFloat(localStorage.getItem(BANCA_KEY) || "100");
}

export function setBanca(v: number): void {
  localStorage.setItem(BANCA_KEY, String(v));
}

export function getOfflineBets(): Aposta[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BETS_OFFLINE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setOfflineBets(bets: Aposta[]): void {
  localStorage.setItem(BETS_OFFLINE_KEY, JSON.stringify(bets));
}
