"use client";

import { useState } from "react";
import {
  buildTeamStats,
  fetchFixtures,
  fetchH2H,
  searchTeams,
  type AFFixture,
  type AFTeam,
  type TeamStats,
} from "@/lib/apiFootball";

type Tab = "t1" | "t2" | "h2h";

export default function StatsPanel({ onClose }: { onClose: () => void }) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [teamIds, setTeamIds] = useState<{ t1: number | null; t2: number | null }>({
    t1: null,
    t2: null,
  });
  const [statsT1, setStatsT1] = useState<TeamStats | null>(null);
  const [statsT2, setStatsT2] = useState<TeamStats | null>(null);
  const [h2h, setH2h] = useState<AFFixture[] | null>(null);
  const [tab, setTab] = useState<Tab>("t1");
  const [picker, setPicker] = useState<{ n: 1 | 2; teams: AFTeam[] } | null>(null);
  const [status, setStatus] = useState<string | null>("Busque os times para ver estatísticas.");
  const [loading, setLoading] = useState(false);

  const showTabs = statsT1 !== null || statsT2 !== null;
  const showH2hTab = teamIds.t1 !== null && teamIds.t2 !== null;

  async function doSearch(n: 1 | 2) {
    const q = (n === 1 ? name1 : name2).trim();
    if (!q) return;
    setPicker(null);
    setStatus("Buscando...");
    setLoading(true);
    try {
      const d = await searchTeams(q);
      if (!d.response || d.response.length === 0) {
        setStatus("Time não encontrado. Tente o nome em inglês.");
        setLoading(false);
        return;
      }
      if (d.response.length === 1) {
        const t = d.response[0].team;
        if (n === 1) setName1(t.name);
        else setName2(t.name);
        await loadTeamStats(n, t.id, t.name);
      } else {
        setStatus(null);
        setPicker({ n, teams: d.response.slice(0, 6) });
        setLoading(false);
      }
    } catch {
      setStatus("Erro ao buscar. Verifique sua conexão.");
      setLoading(false);
    }
  }

  async function selectTeam(n: 1 | 2, id: number, name: string) {
    setPicker(null);
    if (n === 1) setName1(name);
    else setName2(name);
    await loadTeamStats(n, id, name);
  }

  async function loadTeamStats(n: 1 | 2, teamId: number, teamName: string) {
    setStatus("Carregando últimos jogos...");
    setLoading(true);
    setTeamIds((prev) => ({ ...prev, [n === 1 ? "t1" : "t2"]: teamId }));
    try {
      const d = await fetchFixtures(teamId);
      if (!d.response || d.response.length === 0) {
        setStatus("Sem jogos recentes para esse time.");
        setLoading(false);
        return;
      }
      const stats = buildTeamStats(teamName, teamId, d.response);
      if (n === 1) setStatsT1(stats);
      else setStatsT2(stats);
      setStatus(null);
      setTab(n === 1 ? "t1" : "t2");
    } catch {
      setStatus("Erro ao carregar estatísticas.");
    } finally {
      setLoading(false);
    }
  }

  async function loadH2H() {
    if (!teamIds.t1 || !teamIds.t2) {
      setStatus("Busque os dois times primeiro");
      return;
    }
    setStatus("Carregando H2H...");
    setLoading(true);
    try {
      const d = await fetchH2H(teamIds.t1, teamIds.t2);
      setH2h(d.response || []);
      setStatus(null);
      setTab("h2h");
    } catch {
      setStatus("Erro ao carregar H2H.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-rule bg-paper2 mb-3.5 overflow-hidden">
      <div className="flex justify-between items-center px-3 py-[9px] border-b border-rule bg-paper">
        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink3">
          Estatísticas dos times
        </span>
        <button className="font-mono text-[10px] text-ink4" onClick={onClose}>
          fechar ×
        </button>
      </div>

      <div className="px-3 pt-2.5 pb-2">
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          <SearchInput value={name1} onChange={setName1} onSearch={() => doSearch(1)} placeholder="Time 1" />
          <SearchInput value={name2} onChange={setName2} onSearch={() => doSearch(2)} placeholder="Time 2" />
        </div>
        {showH2hTab && (
          <button
            className="w-full py-2 border border-dashed border-rule2 bg-transparent font-mono text-[10px] text-ink4 tracking-wide uppercase"
            onClick={loadH2H}
          >
            Ver confrontos diretos (H2H)
          </button>
        )}
      </div>

      {picker && (
        <div className="px-3 pb-2">
          <div className="font-mono text-[10px] text-ink4 mb-2 uppercase tracking-wide">
            Selecione o time:
          </div>
          {picker.teams.map((t) => (
            <div
              key={t.team.id}
              className="py-2 border-b border-rule cursor-pointer text-[13px] text-ink"
              onClick={() => selectTeam(picker.n, t.team.id, t.team.name)}
            >
              {t.team.name} <span className="font-mono text-[10px] text-ink4">{t.team.country}</span>
            </div>
          ))}
        </div>
      )}

      {showTabs && (
        <div className="flex border-b border-rule">
          <StatsTab label="Time 1" active={tab === "t1"} onClick={() => setTab("t1")} />
          <StatsTab label="Time 2" active={tab === "t2"} onClick={() => setTab("t2")} />
          {showH2hTab && <StatsTab label="H2H" active={tab === "h2h"} onClick={() => setTab("h2h")} />}
        </div>
      )}

      <div className="px-3 py-2.5 min-h-[80px]">
        {status && !picker && (
          <div className="font-mono text-[11px] text-ink4 text-center py-5">{status}</div>
        )}
        {!status && !loading && tab === "t1" && statsT1 && <TeamView d={statsT1} teamId={teamIds.t1!} />}
        {!status && !loading && tab === "t2" && statsT2 && <TeamView d={statsT2} teamId={teamIds.t2!} />}
        {!status && !loading && tab === "h2h" && (
          <H2HView matches={h2h} t1Id={teamIds.t1} name1={name1} name2={name2} />
        )}
      </div>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        className="pr-[70px] text-[13px]"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch();
        }}
      />
      <button
        className="absolute right-0 top-0 bottom-0 px-3.5 bg-ink text-paper font-mono text-[11px] tracking-wide"
        onClick={onSearch}
      >
        buscar
      </button>
    </div>
  );
}

function StatsTab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={`flex-1 py-[7px] px-1 text-center font-mono text-[9px] uppercase tracking-wide border-r border-rule last:border-r-0 transition-colors ${
        active ? "bg-paper text-ink font-medium" : "bg-paper2 text-ink4"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function TeamView({ d, teamId }: { d: TeamStats; teamId: number }) {
  const avgGF = (d.gf / d.n).toFixed(1);
  const avgGA = (d.ga / d.n).toFixed(1);
  const avgTotal = ((d.gf + d.ga) / d.n).toFixed(1);
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2 pb-1.5 border-b border-rule">
        <span className="font-serif italic text-base text-ink">{d.teamName}</span>
        <span className="font-mono text-[10px] text-ink4">
          {d.w}V {d.dr}E {d.l}D · últimos {d.n}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-rule border border-rule mb-2.5 overflow-hidden">
        <Sk label="Méd. gols marc." value={avgGF} />
        <Sk label="Méd. gols sofr." value={avgGA} />
        <Sk label="Méd. total" value={avgTotal} />
      </div>
      <div className="flex flex-col gap-1">
        {d.matches.map((m, i) => {
          const isHome = m.teams.home.id === teamId;
          const tg = (isHome ? m.goals.home : m.goals.away) || 0;
          const og = (isHome ? m.goals.away : m.goals.home) || 0;
          const res = tg > og ? "W" : tg < og ? "L" : "D";
          const resColor = res === "W" ? "var(--win)" : res === "L" ? "var(--lose)" : "var(--warn)";
          const resBg = res === "W" ? "var(--win-bg)" : res === "L" ? "var(--lose-bg)" : "var(--warn-bg)";
          const dt = new Date(m.fixture.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          const opp = isHome ? m.teams.away.name : m.teams.home.name;
          return (
            <div key={i} className="flex items-center gap-1.5 py-1.5 border-b border-rule last:border-b-0">
              <span className="font-mono text-[9px] text-ink4 w-9 flex-shrink-0">{dt}</span>
              <span className="flex-1 text-[11px] text-ink whitespace-nowrap overflow-hidden text-ellipsis">
                {opp} {isHome ? "(C)" : "(F)"}
              </span>
              <span className="font-mono text-[11px] font-medium w-9 text-center flex-shrink-0">
                {tg}–{og}
              </span>
              <div
                className="w-[16px] h-[16px] rounded-[50%] flex items-center justify-center font-mono text-[8px] font-bold flex-shrink-0"
                style={{ background: resBg, color: resColor }}
              >
                {res}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function H2HView({
  matches,
  t1Id,
  name1,
  name2,
}: {
  matches: AFFixture[] | null;
  t1Id: number | null;
  name1: string;
  name2: string;
}) {
  if (!matches || matches.length === 0) {
    return <div className="font-mono text-[11px] text-ink4 text-center py-5">Sem confrontos diretos encontrados.</div>;
  }
  let t1w = 0,
    t2w = 0,
    dr = 0,
    totalGols = 0;
  matches.forEach((m) => {
    const gh = m.goals.home || 0;
    const ga = m.goals.away || 0;
    totalGols += gh + ga;
    if (gh > ga) {
      if (m.teams.home.id === t1Id) t1w++;
      else t2w++;
    } else if (ga > gh) {
      if (m.teams.away.id === t1Id) t1w++;
      else t2w++;
    } else dr++;
  });
  const n = matches.length;
  const avgTotal = (totalGols / n).toFixed(1);
  const t1n = name1 || "Time 1";
  const t2n = name2 || "Time 2";

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2 pb-1.5 border-b border-rule">
        <span className="font-serif italic text-[13px] text-ink">
          {t1n} vs {t2n}
        </span>
        <span className="font-mono text-[10px] text-ink4">{n} jogos</span>
      </div>
      <div className="grid grid-cols-3 gap-px bg-rule border border-rule mb-2.5 overflow-hidden">
        <Sk label={`${t1n.split(" ")[0]} vence`} value={String(t1w)} />
        <Sk label="Empates" value={String(dr)} />
        <Sk label={`${t2n.split(" ")[0]} vence`} value={String(t2w)} />
      </div>
      <div className="grid grid-cols-1 gap-px bg-rule border border-rule mb-2.5 overflow-hidden">
        <Sk label="Média de gols por jogo" value={avgTotal} />
      </div>
      <div className="flex flex-col gap-1">
        {matches.map((m, i) => {
          const dt = new Date(m.fixture.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          return (
            <div key={i} className="flex items-center gap-1.5 py-1.5 border-b border-rule last:border-b-0">
              <span className="font-mono text-[9px] text-ink4 w-9 flex-shrink-0">{dt}</span>
              <span className="flex-1 text-[11px] text-ink whitespace-nowrap overflow-hidden text-ellipsis">
                {m.teams.home.name} × {m.teams.away.name}
              </span>
              <span className="font-mono text-[11px] font-medium w-9 text-center flex-shrink-0">
                {m.goals.home}–{m.goals.away}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Sk({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-paper px-1.5 py-2 text-center">
      <div className="font-mono text-[7px] uppercase tracking-wide text-ink4 mb-[3px]">{label}</div>
      <div className="font-serif text-[15px] font-bold text-ink">{value}</div>
    </div>
  );
}
