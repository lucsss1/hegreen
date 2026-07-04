"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import type { Resultado } from "@/lib/types";
import Sheet from "./Sheet";

export default function ResolverSheet() {
  const { resolverOpen, resolvingId, closeResolver, confirmResolver, bets } = useAppStore();
  const [resultado, setResultado] = useState<Resultado>("ganhou");
  const [oddFech, setOddFech] = useState("");

  const bet = bets.find((b) => b.id === resolvingId);

  useEffect(() => {
    if (resolverOpen) {
      setResultado("ganhou");
      setOddFech("");
    }
  }, [resolverOpen]);

  function confirm() {
    confirmResolver(resultado, oddFech ? parseFloat(oddFech) : null);
  }

  return (
    <Sheet open={resolverOpen} onClose={closeResolver}>
      <div className="font-serif text-lg font-bold text-ink mb-0.5">{bet?.jogo ?? ""}</div>
      <div className="font-mono text-xs text-ink4 mb-4">
        {bet ? `${bet.mercado} · Odd ${bet.odd} · R$ ${bet.stakeR}` : ""}
      </div>

      <div className="mb-3">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Resultado
        </label>
        <select value={resultado} onChange={(e) => setResultado(e.target.value as Resultado)}>
          <option value="ganhou">✓ Ganhou</option>
          <option value="perdeu">✕ Perdeu</option>
          <option value="void">⊘ Void</option>
        </select>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Odd de fechamento (CLV)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="opcional"
          value={oddFech}
          onChange={(e) => setOddFech(e.target.value)}
        />
        <div className="font-mono text-[10px] text-ink4 mt-1">Odd da casa no início do jogo</div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3.5">
        <button
          className="p-3 bg-transparent text-ink3 border border-rule font-mono text-sm"
          onClick={closeResolver}
        >
          Cancelar
        </button>
        <button className="p-3 bg-ink text-paper font-mono text-sm font-semibold" onClick={confirm}>
          Confirmar
        </button>
      </div>
    </Sheet>
  );
}
