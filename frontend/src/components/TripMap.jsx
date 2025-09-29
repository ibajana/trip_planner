
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet';


delete L.Icon.Default.prototype._get


const waypointIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const fuelStopIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default function TripMap({ geojson, waypoints, stops }) {
    if (!geojson) return null

    const coords = geojson.coordinates.map(c => [c[1], c[0]]) // [lat, lon]
    const startPosition = coords[0] || [0, 0];

    return (
        <MapContainer
            center={startPosition}
            zoom={5}
            style={{
                height: '500px',
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' // Sombra sutil
            }}
            scrollWheelZoom={true}
        >

            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
            />

            <Polyline
                positions={coords}
                color="#007bff"
                weight={5}
                opacity={0.8}
            />


            {Object.entries(waypoints).map(([key, val]) => (
                <Marker key={key} position={[val.lat, val.lon]} icon={waypointIcon}>
                    <Popup>
                        <strong>Waypoint:</strong> {key}
                    </Popup>
                </Marker>
            ))}

            {/* Fuel stops */}
            {stops && stops.map((s, i) => (
                <Marker key={i} position={[s.lat, s.lon]} icon={fuelStopIcon}>
                    <Popup>
                        ⛽️ <strong>Parada de Combustible</strong><br />
                        Milla: {s.mile_marker}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}