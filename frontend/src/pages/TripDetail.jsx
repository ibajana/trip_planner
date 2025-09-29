import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import TripMap from '../components/TripMap.jsx'
import TripLog from '../components/TripLog.jsx'

export default function TripDetail() {
    const { id } = useParams()
    const [trip, setTrip] = useState(null)

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/trips/${id}/`)
            .then(res => res.json())
            .then(data => setTrip(data))
            .catch(err => console.error(err))
    }, [id])

    if (!trip) return <p>Cargando viaje...</p>

    return (
        <div className="container py-4">
            <h1>Trip Detail</h1>
            <h3>Map</h3>
            <TripMap geojson={trip.geojson} waypoints={trip.waypoints} stops={trip.stops} />

            <h3>Log Sheets</h3>
            {trip.log_sheets.map((sheet, idx) => (
                <div key={idx} className="mb-4">
                    <h5>Day {idx + 1} – {sheet.date}</h5>
                    <h5>Driver: Jhon Doe</h5>
                    <TripLog logSegments={sheet.segments} />
                </div>
            ))}
        </div>
    )
}
