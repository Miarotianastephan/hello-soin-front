import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige l'affichage de l'icône du marqueur
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Option, Select, Typography } from "@material-tailwind/react";

const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
// Différentes tuiles pour la carte
const tileLayers = {
    "OpenStreetMap": "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "Satellite": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    // "Topographique": "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    "Hybrid": "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  };
  

function LocationMarker({ position, setPosition }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
    },
  });

  return position ? <Marker position={position} icon={defaultIcon} /> : null;
}

export default function MapPicker({ value, onChange }) {
  const [coords, setCoords] = useState(value || { lat: 48.8566, lng: 2.3522 }); // Paris par défaut
  const [mapType, setMapType] = useState("Hybrid"); // Vue par défaut

  useEffect(() => {
    if (value) {
      setCoords(value);
    }
  }, [value]);

  const handleMapClick = (newCoords) => {
    setCoords(newCoords);
    onChange(newCoords);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = parseFloat(value);
    if (!isNaN(newValue)) {
      const newCoords = { ...coords, [name]: newValue };
      setCoords(newCoords);
      onChange(newCoords);
    }
  };

  return (
    <div className="w-full h-full">
        <div className="flex gap-4 mb-2 hidden">
            <div className="w-1/2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                Latitude
                </Typography>
                <input
                    type="number"
                    name="lat"
                    value={coords.lat}
                    onChange={handleInputChange}
                    className="p-2 border rounded w-full"
                    placeholder="Latitude"
                />
            </div>
            <div className="w-1/2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium">
                Longitude
                </Typography>
                <input
                type="number"
                name="lng"
                value={coords.lng}
                onChange={handleInputChange}
                className="p-2 border rounded w-full"
                placeholder="Longitude"
                />
            </div>
        </div>

        {/* Sélecteur de type de carte */}
        <div className="mb-2 relative z-50">
            <Select 
                label="Vue sur la carte"
                value={mapType}
                onChange={(e) => setMapType(e)}
                className="mb-2"
            >
                {Object.keys(tileLayers).map((key) => (
                    <Option className="mb-1" key={key} value={key}>{key}</Option>
                ))}
            </Select>
        </div>

        <div className="h-[85%]">
            <MapContainer center={[coords.lat, coords.lng]} zoom={5} className="h-full w-full leaflet-container">
            <TileLayer url={tileLayers[mapType]} />
            <LocationMarker position={coords} setPosition={handleMapClick} />
            </MapContainer>
        </div>
    </div>
  );
}
