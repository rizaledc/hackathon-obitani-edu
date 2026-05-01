import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapController = ({ selectedLocation }) => {
  const map = useMap();
  React.useEffect(() => {
    if (selectedLocation) {
      map.flyTo([selectedLocation.lat, selectedLocation.lng], 15, { duration: 1.5 });
    }
  }, [selectedLocation, map]);

  useMapEvents({
    click(e) {
      if (selectedLocation?.onMapClick) {
        selectedLocation.onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
};

const MapViewer = ({ onSelectLocation, lahans = [], selectedLocation }) => {
  const defaultCenter = [-2.5, 118];
  const defaultZoom = 5;
  const bounds = [[-11, 95], [6, 141]];

  return (
    <div className="w-full h-full bg-gray-100">
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        minZoom={5}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController selectedLocation={{ ...selectedLocation, onMapClick: onSelectLocation }} />
        {lahans.map((lahan) => {
          if (!lahan.koordinat || !lahan.koordinat.coordinates) return null;
          
          const coords = lahan.koordinat.coordinates[0];
          const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
          const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
          const polygonPositions = coords.map(c => [c[1], c[0]]);
          
          return (
            <React.Fragment key={lahan.id}>
              <Polygon 
                positions={polygonPositions}
                pathOptions={{ color: '#047857', fillColor: '#10b981', fillOpacity: 0.4, weight: 2 }}
                eventHandlers={{ click: () => onSelectLocation(lat, lng, lahan.id) }}
              />
              <CircleMarker 
                center={[lat, lng]} 
                radius={4} 
                pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 1 }}
                eventHandlers={{ click: () => onSelectLocation(lat, lng, lahan.id) }}
              />
            </React.Fragment>
          );
        })}
        {selectedLocation && !selectedLocation.id && (
           <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapViewer;
