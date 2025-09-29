// import { useLocation, useNavigate } from 'react-router-dom'
// import TripMap from '../components/TripMap.jsx'
// import TripLog from '../components/TripLog.jsx'
//
// export default function Results() {
//     const { state } = useLocation()
//     const result = state?.result
//     const navigate = useNavigate()
//
//     if (!result) return <p>No hay datos</p>
//
//     const saveTrip = () => {
//         const saved = JSON.parse(localStorage.getItem('trips') || '[]')
//         saved.push(result)
//         localStorage.setItem('trips', JSON.stringify(saved))
//         alert('Viaje guardado correctamente ✅')
//         navigate('/list')
//     }
//
//     return (
//         <div className="container py-4">
//             <h1>Trip</h1>
//             <div className="row">
//                 <div className="col text-end">
//                     <button className="btn btn-success mb-3 btn-lg" onClick={saveTrip}>
//                         Save
//                     </button>
//                 </div>
//             </div>
//
//             <h3>Map</h3>
//             <TripMap geojson={result.geojson} waypoints={result.waypoints} stops={result.stops} />
//
//             <h3>Log Sheets</h3>
//             {result.log_sheets.map((sheet, idx) => (
//                 <div key={idx}>
//                     <h5>DAY {idx + 1}</h5>
//                     <TripLog logSegments={sheet} />
//                 </div>
//             ))}
//         </div>
//     )
// }
import { useLocation, useNavigate } from 'react-router-dom'
import TripMap from '../components/TripMap.jsx'
import TripLog from '../components/TripLog.jsx'

export default function Results() {
    const { state } = useLocation()
    const result = state?.result
    const navigate = useNavigate()

    // ... (Lógica de verificación de resultado y saveTrip igual)
    if (!result) {
        return (
            <div className="container py-5 text-center">
                <p className="lead text-muted">No se encontraron datos de viaje. Por favor, intenta de nuevo.</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
                    Volver al Inicio
                </button>
            </div>
        )
    }

    const saveTrip = async () => {
        try {
            const res = await fetch("https://trip-planner-qzqj.onrender.com/api/trips/save/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result)
            })
            if (!res.ok) throw new Error("Error al guardar en backend")
            alert("Viaje guardado correctamente")
        } catch (err) {
            console.error(err)
            alert("No se pudo guardar el viaje")
        }
    }

    return (
        <div className="container py-5">
            {/* Cabecera (Título y Acción) - Igual que antes */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h1 className="display-4 fw-bold">Trip Details</h1>
                <button
                    className="btn btn-primary btn-lg shadow-sm"
                    onClick={saveTrip}
                    style={{ minWidth: '150px' }}
                >
                    <i className="bi bi-save me-2"></i>
                    Save Trip
                </button>
            </div>

            {/* --- NUEVA ESTRUCTURA DE LAYOUT --- */}
            <div className="row g-4">

                {/* 1. Columna Principal (8/12) - EL MAPA ES EL FOCO */}
                <div className="col-lg-8">
                    <section className="h-100">
                        <h2 className="h4 text-primary mb-3">Trip Route</h2>
                        {/* El Mapa toma la mayor parte del espacio horizontal */}
                        <TripMap
                            geojson={result.geojson}
                            waypoints={result.waypoints}
                            stops={result.stops}
                        />
                    </section>
                </div>

                {/* 3. Columna Inferior (12/12) - REGISTROS DE TIEMPO (Log Sheets) */}
                <div className="col-12 mt-4">
                    <section>
                        <h2 className="h4 text-primary mb-4">Daily Log</h2>
                        <div className="row g-4">
                            {result.log_sheets.map((sheet, idx) => (
                                <div key={idx} className="mb-4">
                                    <h5>Day {idx + 1} – {sheet.date}</h5>
                                    <h5>Driver: Jhon Doe</h5>
                                    <TripLog logSegments={sheet.segments} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}