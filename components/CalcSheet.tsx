"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { calcEV, calcPMkt, fmt, stakeFrom } from "@/lib/calc";
import Sheet from "./Sheet";

export default function CalcSheet() {
  const { calcOpen, closeCalc, setCalcTransfer, toast } = useAppStore();
  const router = useRouter();
  const [o1, setO1] = useState("");
  const [o2, setO2] = useState("");
  const [prob, setProb] = useState("");
  const [odd, setOdd] = useState("");

  const pMkt = calcPMkt(o1, o2);
  const ev = calcEV(prob, odd);

  function useCalc() {
    setCalcTransfer({ odd: o1, oddC: o2, prob });
    closeCalc();
    router.push("/registrar");
    toast("Transferido para o formulário");
  }

  return (
    <Sheet open={calcOpen} onClose={closeCalc}>
      <div className="font-serif text-lg font-bold text-ink mb-1">Calculadora</div>
      <div className="font-mono text-xs text-ink4 mb-4">Overround e EV simulado.</div>

      <div className="mb-3">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Odd do seu mercado
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="2.10"
          value={o1}
          onChange={(e) => setO1(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Odd contrária
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="1.75"
          value={o2}
          onChange={(e) => setO2(e.target.value)}
        />
        <div className="font-mono text-[10px] text-ink4 mt-1">Over ↔ Under, etc.</div>
      </div>

      <div className="border border-rule px-3.5 py-3 font-mono text-sm text-ink4 bg-paper2 min-h-[42px]">
        {pMkt != null ? (
          <>
            P. Mercado real:{" "}
            <span className="font-serif text-lg font-bold text-win">{fmt(pMkt)}%</span>
          </>
        ) : (
          "Preencha as odds para ver P. Mercado real"
        )}
      </div>

      <div className="mt-3.5">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Simular EV
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <input
            type="number"
            step="0.1"
            placeholder="Prob. %"
            value={prob}
            onChange={(e) => setProb(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Odd"
            value={odd}
            onChange={(e) => setOdd(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-rule px-3.5 py-3 font-mono text-sm text-ink4 bg-paper2 min-h-[42px] mt-0">
        {ev != null ? (
          <>
            EV:{" "}
            <span
              className="font-serif text-lg font-bold"
              style={{ color: ev >= 5 ? "var(--win)" : ev < 0 ? "var(--lose)" : "var(--warn)" }}
            >
              {ev >= 0 ? "+" : ""}
              {fmt(ev)}%
            </span>{" "}
            · Stake: <span className="font-serif text-lg font-bold">{stakeFrom(ev).l}</span>
          </>
        ) : (
          "Preencha prob. e odd"
        )}
      </div>

      <button
        className="w-full p-[11px] bg-ink text-paper font-mono text-xs font-semibold uppercase tracking-wider mt-3"
        onClick={useCalc}
      >
        Usar no formulário
      </button>
    </Sheet>
  );
}
