export type FuelKey = 'gazole' | 'e10' | 'sp95' | 'sp98' | 'e85' | 'gplc';

export const FUELS: { key: FuelKey; label: string }[] = [
  { key: 'gazole', label: 'Gazole' },
  { key: 'e10', label: 'E10' },
  { key: 'sp95', label: 'SP95' },
  { key: 'sp98', label: 'SP98' },
  { key: 'e85', label: 'E85' },
  { key: 'gplc', label: 'GPLc' },
];

export interface Station {
  id: string;
  name: string;
  address: string;
  cp: string;
  city: string;
  lat: number;
  lon: number;
  prices: Partial<Record<FuelKey, number>>;
  hours: string[];
}

export const fmt = (n: number) => n.toFixed(3).replace('.', ',') + ' €';