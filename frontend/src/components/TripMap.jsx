// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
//
// export default function TripMap({ geojson, waypoints, stops }) {
//     if (!geojson) return null
//
//     const coords = geojson.coordinates.map(c => [c[1], c[0]]) // [lat, lon]
//
//     return (
//         <MapContainer center={coords[0]} zoom={5} style={{ height: '500px', width: '100%' }}>
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; OpenStreetMap contributors"
//             />
//
//             <Polyline positions={coords} color="blue" />
//
//             {/* Waypoints */}
//             {Object.entries(waypoints).map(([key, val]) => (
//                 <Marker key={key} position={[val.lat, val.lon]}>
//                     <Popup>{key}</Popup>
//                 </Marker>
//             ))}
//
//             {/* Fuel stops */}
//             {stops && stops.map((s, i) => (
//                 <Marker key={i} position={[s.lat, s.lon]}>
//                     <Popup>Fuel stop @ {s.mile_marker} miles</Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     )
// }

import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
// Importar iconos personalizados de Leaflet (para un look más moderno)
import L from 'leaflet';

// Eliminar el icono predeterminado feo de Leaflet
delete L.Icon.Default.prototype._get // Para que Leaflet use el ícono por defecto

// Icono personalizado para Waypoints
const waypointIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Icono personalizado para Fuel Stops (rojo para una alerta/interrupción)
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
                borderRadius: '8px', // Bordes redondeados para un look moderno
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' // Sombra sutil
            }}
            scrollWheelZoom={true} // Permitir zoom con la rueda del ratón
        >
            {/* Opción 1: Tema CartoDB Positron (ligero y moderno) */}
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
            />

            {/* Opcional: Para un look más oscuro/contrastado, usar CartoDB DarkMatter */}
            {/* <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
            />
            */}

            {/* Polyline con estilo mejorado: más grueso y color distintivo */}
            <Polyline
                positions={coords}
                color="#007bff" // Azul primario para la ruta
                weight={5}      // Más grueso para destacar
                opacity={0.8}   // Un poco de transparencia
            />

            {/* Waypoints */}
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