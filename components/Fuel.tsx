'use client';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FUELS, fmt, type FuelKey, type Station } from '@/lib/shared';

const StationMap = dynamic(() => import('./Map'), { ssr: false });

const TIERS = [
  { label: 'Les moins chères', color: '#0e5fd8' },
  { label: 'Prix moyens', color: '#98a2b3' },
  { label: 'Les plus chères', color: '#d2471e' },
];

export default function FuelApp({ stations }: { stations: Station[] }) {
  const [fuel, setFuel] = useState<FuelKey>('gazole');

  const sorted = useMemo(
    () =>
      stations
        .filter((s) => s.prices[fuel] != null)
        .sort((a, b) => a.prices[fuel]! - b.prices[fuel]!),
    [stations, fuel],
  );

  const legend = useMemo(() => {
    const n = sorted.length;
    const cuts = [0, Math.ceil(n / 3), Math.ceil((2 * n) / 3), n];

    return TIERS.map((t, k) => ({ ...t, from: cuts[k], to: cuts[k + 1] - 1 }))
      .filter((t) => t.to >= t.from)
      .map((t) => ({
        ...t,
        min: sorted[t.from].prices[fuel]!,
        max: sorted[t.to].prices[fuel]!,
      }));
  }, [sorted, fuel]);

  const points = useMemo(
    () =>
      sorted.map((s, i) => ({
        id: s.id,
        name: s.name,
        address: `${s.address}, ${s.cp} ${s.city}`,
        lat: s.lat,
        lon: s.lon,
        price: fmt(s.prices[fuel]!),
        hours: s.hours,
        color:
          i < sorted.length / 3
            ? TIERS[0].color
            : i < (sorted.length * 2) / 3
              ? TIERS[1].color
              : TIERS[2].color,
      })),
    [sorted, fuel],
  );

  return (
    <main className="app">
      <aside className="panel">
        <h1>Prix des carburants</h1>

        <div className="fuels">
          {FUELS.map((f) => (
            <button key={f.key} className={f.key === fuel ? 'on' : ''} onClick={() => setFuel(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="legend">
          {legend.map((t) => (
            <div key={t.label} className="tier">
              <i style={{ background: t.color }} />
              <span>{t.label}</span>
              <small>
                {fmt(t.min)} à {fmt(t.max)}
              </small>
            </div>
          ))}
        </div>

        <p className="info">{sorted.length} stations. Les 5 moins chères :</p>

        <ol>
          {sorted.slice(0, 5).map((s) => (
            <li key={s.id}>
              <span>
                <b>{s.name}</b>
                <small>
                  {s.cp} {s.city}
                </small>
              </span>
              <strong>{fmt(s.prices[fuel]!)}</strong>
            </li>
          ))}
        </ol>
      </aside>

      <div className="map">
        <StationMap points={points} />
      </div>
    </main>
  );
}