import FuelApp from '@/components/Fuel';
import { loadStations } from '../lib/load';

export default function Page() {
  return <FuelApp stations={loadStations()} />;
}