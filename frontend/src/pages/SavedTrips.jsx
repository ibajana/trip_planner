import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function SavedTrips() {
    const [trips, setTrips] = useState([])

    useEffect(() => {
        fetch("https://trip-planner-qzqj.onrender.com/api/trips/")
            .then(res => res.json())
            .then(data => setTrips(data))
    }, [])

    return (
        <div className="container py-4">
            <h1>Saved Trips</h1>
            {trips.length === 0 ? (
                <p>There are no saved trips</p>
            ) : (
                <ul className="list-group">
                    {trips.map((trip) => (
                        <Link to={`/trips/${trip.id}`}>
                            <li key={trip.id} className="list-group-item">
                                <strong>{trip?.summary?.origin} → {trip?.summary?.dropoff}</strong>
                                <br />
                                {trip.summary.distance_miles} miles – {trip.log_sheets.length} day(s)
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
            <Link to="/" className="btn btn-primary mt-3">New trip</Link>
        </div>
    )
}
