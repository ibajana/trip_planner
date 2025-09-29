import { useState } from 'react';
import axios from 'axios';

export default function TripForm({ onResult }) {
    const [form, setForm] = useState({
        origin: '',
        pickup: '',
        dropoff: '',
        cycle_used_hours: 0
    });
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const res = await axios.post('https://trip-planner-qzqj.onrender.com/api/plan_trip/', form);
            onResult(res.data);
        } catch (err) {
            console.error(err);
            alert('Error');
        } finally {
            setLoading(true)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border rounded">
            <div className="mb-2">
                <label>Origin</label>
                <input className="form-control" name="origin" value={form.origin} onChange={handleChange} />
            </div>
            <div className="mb-2">
                <label>Pickup</label>
                <input className="form-control" name="pickup" value={form.pickup} onChange={handleChange} />
            </div>
            <div className="mb-2">
                <label>Dropoff</label>
                <input className="form-control" name="dropoff" value={form.dropoff} onChange={handleChange} />
            </div>
            <div className="mb-2">
                <label>Cycle Used Hours</label>
                <input type="number" className="form-control" name="cycle_used_hours" value={form.cycle_used_hours} onChange={handleChange} />
            </div>
            <button className="btn btn-primary" disabled={loading}>
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                    </>
                ) : (
                    "Plan Trip"
                )}
            </button>
        </form>
    );
}
