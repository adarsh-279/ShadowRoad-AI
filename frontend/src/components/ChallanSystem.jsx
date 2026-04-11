import React, { useState } from 'react';
import axios from 'axios';

const ChallanSystem = () => {
  const [speed, setSpeed] = useState(30);
  const [zone, setZone] = useState('school');
  const [helmet, setHelmet] = useState(true);
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/simulator/check', {
        speed: parseInt(speed),
        zone,
        helmet
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ serverError: true, message: "Could not connect to the backend server." });
    }
  };

  return (
    <section className="section section-dark" id="auto-challan">
      <div className="container">
        <div className="section-header">
          <div className="section-badge challan-badge">Auto-Challan System</div>
          <h2 className="section-title">AI-Powered Traffic Fines</h2>
          <p className="section-desc">Automatic violation detection when driver enters any mapped zone. Zero manual intervention.</p>
        </div>
        <div className="challan-zones">
          <div className="zone-card school-zone">
            <div className="zone-icon">🏫</div>
            <div className="zone-name">School Zone</div>
            <div className="zone-speed">25 km/h</div>
            <div className="zone-label">Speed Limit</div>
          </div>
          <div className="zone-card hospital-zone">
            <div className="zone-icon">🏥</div>
            <div className="zone-name">Hospital Zone</div>
            <div className="zone-speed">20 km/h</div>
            <div className="zone-label">Speed Limit</div>
          </div>
          <div className="zone-card highway-zone">
            <div className="zone-icon">🛣️</div>
            <div className="zone-name">Highway</div>
            <div className="zone-speed">120 km/h</div>
            <div className="zone-label">Speed Limit</div>
          </div>
        </div>
        
        <div className="revenue-banner" id="revenue-banner">
          <div className="rev-main">₹24,000 Crore / Year — India Revenue</div>
          <div className="rev-sub">↑ Currently being missed — ShadowRoad captures it automatically</div>
        </div>

        {/* Live Demo: Challan Simulator */}
        <div className="demo-box" id="challan-demo" style={{opacity: 1, transform: 'none'}}>
          <div className="demo-title">🎮 Live Challan Simulator</div>
          <div className="demo-content">
            <div className="sim-controls">
              <div className="sim-group">
                <label className="sim-label" htmlFor="sim-zone">Select Zone</label>
                <select className="sim-select" id="sim-zone" value={zone} onChange={e => setZone(e.target.value)}>
                  <option value="school">School Zone (25 km/h)</option>
                  <option value="hospital">Hospital Zone (20 km/h)</option>
                  <option value="highway">Highway (120 km/h)</option>
                  <option value="city">City Road (50 km/h)</option>
                </select>
              </div>
              <div className="sim-group">
                <label className="sim-label" htmlFor="sim-speed">Your Speed (km/h)</label>
                <input type="range" className="sim-slider" id="sim-speed" min="0" max="150" value={speed} onChange={e => setSpeed(e.target.value)} />
                <div className="sim-speed-val" id="sim-speed-display">{speed} km/h</div>
              </div>
              <div className="sim-group">
                <label className="sim-label" htmlFor="sim-helmet">Helmet On?</label>
                <div className="sim-toggle-wrap">
                  <input type="checkbox" className="sim-toggle" id="sim-helmet" checked={helmet} onChange={e => setHelmet(e.target.checked)} />
                  <label htmlFor="sim-helmet" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <button className="sim-btn" onClick={handleCheck}>🔍 Check Violations</button>
            
            {result && (
              <div className={`sim-result ${result.safe ? 'result-safe' : 'result-violation'}`} aria-live="polite">
                {result.serverError ? (
                  <div>{result.message}</div>
                ) : result.safe ? (
                  <div dangerouslySetInnerHTML={{__html: result.message}}></div>
                ) : (
                  <div>
                    {result.violations.map((v, i) => <div key={i}>{v}</div>)}
                    <br />
                    <strong>Total Challan: ₹{(result.totalFine || 0).toLocaleString('en-IN')}</strong>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallanSystem;
