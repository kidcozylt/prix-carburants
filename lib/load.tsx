import fs from 'node:fs';
import path from 'node:path';
import { FUELS, type Station } from './shared';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function formatTime(s: string) {
  const [h, m] = s.split('.');
  return `${Number(h)} h ${m}`;
}

function parseHours(raw: string | null): string[] {
  if (!raw) return [];
  const t = JSON.parse(raw);

  return DAYS.filter((d) => t[d]).map((d) => {
    const v = t[d];
    if (!v.ouvert) return `${d} : fermé`;
    if (!v.ouverture || !v.fermeture) return `${d} : ouvert`;
    if (v.ouverture === v.fermeture) return `${d} : ouvert 24 h/24`;
    return `${d} : ${formatTime(v.ouverture)} – ${formatTime(v.fermeture)}`;
  });
}

export function loadStations(): Station[] {
  const file = path.join(process.cwd(), 'data', 'prix-des-carburants-j-7.json');
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const stations: Station[] = [];

  for (const r of raw) {
    if (!r.geo_point) continue;
    const shortage = (r.shortage ?? []).map((s: string) => s.toLowerCase());
    const prices: Station['prices'] = {};

    for (const { key } of FUELS) {
      const p = r['price_' + key];
      if (typeof p === 'number' && p > 0.5 && p < 5 && !shortage.includes(key)) {
        prices[key] = p;
      }
    }

    stations.push({
      id: r.id,
      name: r.name ?? r.brand ?? 'Station',
      address: r.address ?? '',
      cp: r.cp ?? '',
      city: r.city ?? '',
      lat: r.geo_point.lat,
      lon: r.geo_point.lon,
      prices,
      hours: parseHours(r.timetable),
    });
  }
  return stations;
}