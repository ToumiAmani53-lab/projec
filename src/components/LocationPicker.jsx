import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Icône de marqueur personnalisée (couleur terre cuite SoundFarm)
const farmIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 0C7.2 0 0 7.2 0 16c0 11 16 26 16 26s16-15 16-26c0-8.8-7.2-16-16-16z" fill="#B4673B"/>
      <circle cx="16" cy="16" r="6.5" fill="#F7F3E8"/>
    </svg>
  `),
  iconSize: [32, 42],
  iconAnchor: [16, 42],
});

const ClickHandler = ({ onPick }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker = ({ initialPosition, onChange, height = 280 }) => {
  const [position, setPosition] = useState(initialPosition || { lat: 36.8065, lng: 10.1815 }); // Tunis par défaut

  const handlePick = (lat, lng) => {
    const newPos = { lat, lng };
    setPosition(newPos);
    onChange(newPos);
  };

  return (
    <div style={{ height, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-line)' }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[position.lat, position.lng]} icon={farmIcon} />
        <ClickHandler onPick={handlePick} />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
