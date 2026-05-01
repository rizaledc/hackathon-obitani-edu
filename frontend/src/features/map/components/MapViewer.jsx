import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polygon, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ClickHandler = ({ onSelectLocation, isDrawingMode }) => {
  useMapEvents({
    click(e) {
      if (isDrawingMode && onSelectLocation) {
        onSelectLocation(e.latlng.lat, e.latlng.lng, null);
      }
    }
  });
  return null;
};

const MapViewer = ({ onSelectLocation, lahans = [], selectedLocation, mapRef, draftPoints = [], isDrawingMode = false, samplePoints = [], selectedId }) => {
  const defaultCenter = [-2.5, 118];
  const defaultZoom = 5;
  const bounds = [[-11, 95], [6, 141]];

  const renderLahan = (lahan) => {
    try {
      const coords = lahan.koordinat?.coordinates?.[0];
      if (!coords || coords.length < 3) return null;
      
      const positions = coords.map(c => [c[1], c[0]]);
      const lat = coords.reduce((s,c) => s + c[1], 0) / coords.length;
      const lng = coords.reduce((s,c) => s + c[0], 0) / coords.length;
      
      if (positions.some(p => isNaN(p[0]) || isNaN(p[1]))) return null;
      
      return (
        <React.Fragment key={lahan.id}>
          <Polygon positions={positions} 
            pathOptions={{
               color: selectedLocation?.id === lahan.id ? '#059669' : '#047857', 
               fillColor: selectedLocation?.id === lahan.id ? '#34d399' : '#10b981', 
               fillOpacity: selectedLocation?.id === lahan.id ? 0.6 : 0.4,
               weight: selectedLocation?.id === lahan.id ? 3 : 2
            }} 
            eventHandlers={{ click: (e) => {
              onSelectLocation(lat, lng, lahan.id);
            }}} />
        </React.Fragment>
      );
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full h-full bg-gray-100" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer 
        ref={mapRef}
        center={defaultCenter} 
        zoom={defaultZoom} 
        zoomControl={false}
        minZoom={5}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true} 
        className="w-full h-full z-0"
        style={{ height: '100%', width: '100%' }}
        onClick={(e) => onSelectLocation(e.latlng.lat, e.latlng.lng)}
      >
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <ClickHandler onSelectLocation={onSelectLocation} isDrawingMode={isDrawingMode} />
        
        {draftPoints && draftPoints.length > 0 && (
          <>
            {draftPoints.length < 3 ? (
              <Polyline positions={draftPoints} pathOptions={{ color: '#3b82f6', weight: 3, dashArray: '5, 10' }} />
            ) : (
              <Polygon positions={draftPoints} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.4, weight: 3, dashArray: '5, 10' }} />
            )}
            {draftPoints.map((pos, idx) => (
              <CircleMarker key={idx} center={pos} radius={5} pathOptions={{ color: '#2563eb', fillColor: '#fff', fillOpacity: 1, weight: 2 }} />
            ))}
          </>
        )}

        {lahans.map((lahan) => renderLahan(lahan))}

        {samplePoints && samplePoints
          .filter(point => point.lahan_id === selectedId)
          .map((point, i) => {
          if (!point.latitude || !point.longitude) return null;
          return (
            <CircleMarker
              key={`sample-${i}`}
              center={[point.latitude, point.longitude]}
              radius={5}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444', 
                fillOpacity: 1,
                weight: 2
              }}
            />
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
