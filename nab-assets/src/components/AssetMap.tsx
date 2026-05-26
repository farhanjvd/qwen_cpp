import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Asset } from '../types';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface AssetMapProps {
  assets: Asset[];
}

export default function AssetMap({ assets }: AssetMapProps) {
  const propertyAssets = assets.filter(
    (a) => a.type !== 'vehicle' && a.latitude && a.longitude
  );

  if (propertyAssets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-nab-card rounded-xl">
        <p className="text-nab-gray">No properties with location data</p>
      </div>
    );
  }

  const center: [number, number] = [33.6844, 73.0479]; // Islamabad center

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={true}
      className="w-full h-full rounded-xl"
      style={{ background: '#1c1c1e' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {propertyAssets.map((asset) => (
        <Marker key={asset.id} position={[asset.latitude!, asset.longitude!]}>
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-nab-darker">{asset.title}</h3>
              <p className="text-sm text-gray-600 capitalize">{asset.type}</p>
              {asset.size && <p className="text-sm text-gray-600">Size: {asset.size}</p>}
              <p className="text-nab-blue font-semibold mt-1">
                Rs. {asset.value.toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
