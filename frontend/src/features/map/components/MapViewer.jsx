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

const ClickHandler = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      if (onSelectLocation) onSelectLocation(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const MapViewer = ({ onSelectLocation, lahans = [], selectedLocation, mapRef }) => {
  const defaultCenter = [-2.5, 118];
  const defaultZoom = 5;
  const bounds = [[-11, 95], [6, 141]];

  const renderLahan = (lahan) => {
    const coords = lahan.koordinat?.coordinates?.[0];
    if (!coords || coords.length < 3) return null;
    
    const positions = coords.map(c => [c[1], c[0]]);
    const centroid = [
      coords.reduce((s,c) => s + c[1], 0) / coords.length,
      coords.reduce((s,c) => s + c[0], 0) / coords.length
    ];
    
    if (positions.some(p => isNaN(p[0]) || isNaN(p[1]))) return null;
    
    return (
      <React.Fragment key={lahan.id}>
        <Polygon positions={positions} 
          pathOptions={{color: '#047857', fillColor: '#10b981', fillOpacity: 0.4}} 
          eventHandlers={{ click: () => onSelectLocation(centroid[0], centroid[1], lahan.id) }} />
        <CircleMarker center={centroid} radius={6}
          pathOptions={{color: 'red', fillColor: 'red', fillOpacity: 1}} 
          eventHandlers={{ click: () => onSelectLocation(centroid[0], centroid[1], lahan.id) }} />
      </React.Fragment>
    );
  };

  return (
    <div className="w-full h-full bg-gray-100">
      <MapContainer 
        ref={mapRef}
        center={defaultCenter} 
        zoom={defaultZoom} 
        minZoom={5}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        onClick={(e) => onSelectLocation(e.latlng.lat, e.latlng.lng)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelectLocation={onSelectLocation} />
        {lahans.map((lahan) => renderLahan(lahan))}
        {selectedLocation && !selectedLocation.id && (
           <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapViewer;
