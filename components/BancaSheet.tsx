"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import Sheet from "./Sheet";

export default function BancaSheet() {
  const { bancaSheetOpen, closeBancaSheet, setBancaValue, toast } = useAppStore();
  const [value, setValue] = useState("");

  function save() {
    const v = parseFloat(value);
    if (!v || v <= 0) {
      toast("Valor inválido");
      return;
    }
    setBancaValue(v);
    closeBancaSheet();
    toast("Banca atualizada");
  }

  return (
    <Sheet open={bancaSheetOpen} onClose={closeBancaSheet}>
      <div className="font-serif text-lg font-bold text-ink mb-[13px]">Banca inicial</div>
      <div className="mb-[13px]">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-ink3 mb-1.5">
          Valor (R$)
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3.5">
        <button
          className="p-3 bg-transparent text-ink3 border border-rule font-mono text-sm"
          onClick={closeBancaSheet}
        >
          Cancelar
        </button>
        <button className="p-3 bg-ink text-paper font-mono text-sm font-semibold" onClick={save}>
          Salvar
        </button>
      </div>
    </Sheet>
  );
}
