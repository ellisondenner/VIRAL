"use client";

// Componentes visuais simples (sem biblioteca externa) para os gráficos.

export function ScoreRing({ value }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 70 ? "#22c55e" : value >= 40 ? "#eab308" : "#ef4444";
  return (
    <div className="relative h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold">{value}</span>
        <span className="text-xs text-white/50">de 100</span>
      </div>
    </div>
  );
}

export function ScoreBar({ label, value }) {
  const color = value >= 70 ? "bg-green-500" : value >= 40 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function BarList({ items, max, format }) {
  const top = max || Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3 text-sm">
          <span className="w-28 shrink-0 text-white/70">{it.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-400 to-indigo-400"
              style={{ width: `${(it.value / top) * 100}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-white/60">
            {format ? format(it.value) : it.value}
          </span>
        </div>
      ))}
    </div>
  );
}
