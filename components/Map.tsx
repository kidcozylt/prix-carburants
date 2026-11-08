'use client';
import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';

export interface Point {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  price: string;
  color: string;
  hours: string[];
}

export default function StationMap({ points }: { points: Point[] }) {
  return (
    <MapContainer center={[48.85, 2.35]} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {points.map((p) => (
        <CircleMarker
          key={p.id}
          center={[p.lat, p.lon]}
          radius={7}
          pathOptions={{ color: '#fff', weight: 1.5, fillColor: p.color, fillOpacity: 0.95 }}
        >
          <Popup>
            <strong>{p.name}</strong>
            <br />
            {p.address}
            <br />
            {p.price}
            <br />
            <br />
            {p.hours.length > 0
              ? p.hours.map((h) => <div key={h}>{h}</div>)
              : 'Horaires non communiqués'}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}