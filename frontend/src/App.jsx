import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Results from './pages/Results'
import SavedTrips from './pages/SavedTrips'
import TripDetail from './pages/TripDetail'
import PillNav from "./components/PillNav"
import ContactSimpleForm from './pages/ContacForm.jsx'


function App() {
    return (
        <div>
            {/* Navbar simple */}
            {/*<nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">*/}
            {/*    <div className="container-fluid">*/}
            {/*        <Link className="navbar-brand" to="/">Trip Planner || Log Sheet Generator</Link>*/}
            {/*        <div>*/}
            {/*            <ul className="navbar-nav me-auto mb-2 mb-lg-0">*/}
            {/*                /!*<li className="nav-item">*!/*/}
            {/*                /!*    <Link className="nav-link" to="/">Login</Link>*!/*/}
            {/*                /!*</li>*!/*/}
            {/*                /!*<li className="nav-item">*!/*/}
            {/*                /!*    <Link className="nav-link" to="/">Logout</Link>*!/*/}
            {/*                /!*</li>*!/*/}
            {/*                <li className="nav-item">*/}
            {/*                    <Link className="nav-link" to="/list">Saved Trips</Link>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</nav>*/}
            <PillNav
                logoAlt="Company Logo"
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Saved Trips', href: '/list' },
                    { label: 'Contact', href: '/contact' }
                ]}
                activeHref="/"
                className="custom-nav navbar mx-auto"
                ease="power2.easeOut"
                baseColor="#000000"
                pillColor="#ffffff"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#000000"
            />
            <div className="container py-4 mt-3">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/list" element={<SavedTrips />} />
                    <Route path="/trips/:id" element={<TripDetail />} />
                    <Route path="/contact" element={<ContactSimpleForm />} />
                </Routes>
            </div>
        </div>
    )
}

export default App
