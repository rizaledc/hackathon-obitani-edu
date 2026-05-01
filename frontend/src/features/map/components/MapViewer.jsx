import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const LocationMarker = ({ onSelectLocation }) => {
  const [position, setPosition] = React.useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onSelectLocation) {
        onSelectLocation(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapViewer = ({ onSelectLocation, lahans = [] }) => {
  // Center map on Indonesia
  const defaultCenter = [-0.7893, 113.9213];
  const defaultZoom = 5;

  return (
    <div className="w-full h-full bg-gray-100">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {lahans.map((lahan) => (
          <Marker 
            key={lahan.id} 
            position={[lahan.lat, lahan.lng]} 
            eventHandlers={{ click: () => onSelectLocation(lahan.lat, lahan.lng, lahan.id) }} 
          />
        ))}
        <LocationMarker onSelectLocation={onSelectLocation} />
      </MapContainer>
    </div>
  );
};

export default MapViewer;
