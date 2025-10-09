import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Card from '../components/ui/Card';
import 'leaflet/dist/leaflet.css';

const markers = [
  { position: [31.963158, 35.930359], label: 'لجنة رئيسية 1' },
  { position: [32.055662, 36.094193], label: 'لجنة ثانوية 4' }
];

const MapView = () => (
  <Card title="الخريطة الميدانية">
    <div className="h-[480px] w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
      <MapContainer center={[31.963158, 35.930359]} zoom={9} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker key={marker.label} position={marker.position as [number, number]}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </Card>
);

export default MapView;
