import React, { useState, useEffect, useRef, useCallback } from 'react';
import MapComponent from './MapComponent';

const LiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [demoState, setDemoState] = useState('safe'); // 'safe', 'warn', 'danger'
  const [ambulanceStatus, setAmbulanceStatus] = useState(null); // 'alerting', 'dispatched', 'arrived'
  
  // Real-time sensor state
  const [speed, setSpeed] = useState(45);
  const [gyro, setGyro] = useState({ x: 0.02, y: -0.01, z: 0.98 });
  const [gps, setGps] = useState({ lat: 13.0827, lng: 80.2707 });
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info', time: '10:00:01', msg: 'System initialized. Sensors active.' },
  ]);

  // Use refs to efficiently manage loop without constant re-rendering/re-binding
  const simInterval = useRef(null);
  const stepRef = useRef(0);
  const alertsEndRef = useRef(null);

  // Auto-scroll alerts
  useEffect(() => {
    if (alertsEndRef.current) {
      alertsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [alerts]);

  const addAlert = useCallback((type, msg) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAlerts(prev => [...prev.slice(-49), { id: Date.now(), type, time, msg }]);
  }, []);

  const simulateStep = useCallback(() => {
    stepRef.current += 1;
    const step = stepRef.current;

    // Simulate GPS movement
    setGps(prev => ({ lat: prev.lat + 0.0001, lng: prev.lng + 0.0001 }));

    // Simulate Gyro jitter
    setGyro({
      x: (Math.random() * 0.1 - 0.05).toFixed(2),
      y: (Math.random() * 0.1 - 0.05).toFixed(2),
      z: (0.95 + Math.random() * 0.1).toFixed(2)
    });

    if (step < 20) {
      // Normal driving
      setSpeed(prev => Math.min(prev + 1, 65));
      if (step === 5) addAlert('safe', 'Route mapped. Conditions optimal.');
    } else if (step >= 20 && step < 40) {
      // Entering danger zone
      setDemoState('warn');
      if (step === 20) {
        addAlert('warn', 'Approaching high-risk intersection (Accident cluster).');
        addAlert('warn', 'Speeding detected: 65 km/h in 50 km/h zone.');
      }
      setSpeed(65 + Math.floor(Math.random() * 5));
    } else if (step >= 40 && step < 50) {
      // Crash predicted & Sudden braking
      setDemoState('danger');
      if (step === 40) {
        addAlert('danger', 'CRITICAL WARN: High probability of collision in 30s!');
        setGyro({ x: 1.5, y: -2.3, z: 0.1 }); // Violent gyro swing
      }
      setSpeed(prev => Math.max(prev - 8, 0));
    } else if (step >= 50) {
      // Impact detected / Alert sent
      setSpeed(0);
      setGyro({ x: 0, y: 0, z: 0 });
      if (step === 50) {
        addAlert('danger', 'IMPACT DETECTED! G-Force spike: 4.8G');
        addAlert('info', 'Executing Auto-Alert... Notifying Emergency Contacts.');
      }
      if (step === 52) {
        addAlert('warn', '🚨 Alerting nearby hospitals... Pinpointing location.');
        setAmbulanceStatus('alerting');
      }
      if (step === 55) {
        addAlert('safe', '🏥 City Care Hospital accepted alert! Ambulance dispatched.');
        setAmbulanceStatus('dispatched');
      }
      if (step === 65) {
        addAlert('info', '🚑 Ambulance has arrived at crash location.');
        setAmbulanceStatus('arrived');
      }
      if (step > 70) {
        clearInterval(simInterval.current);
        setIsRunning(false);
      }
    }
  }, [addAlert]);

  const startDemo = () => {
    if (isRunning) return;
    setIsRunning(true);
    setDemoState('safe');
    setAmbulanceStatus(null);
    setSpeed(45);
    stepRef.current = 0;
    setAlerts([{ id: Date.now(), type: 'info', time: new Date().toLocaleTimeString('en-IN', { hour12: false }), msg: 'Demo Started. Calibrating sensors...' }]);
    
    if (simInterval.current) clearInterval(simInterval.current);
    simInterval.current = setInterval(simulateStep, 700);
  };

  const stopDemo = () => {
    setIsRunning(false);
    if (simInterval.current) clearInterval(simInterval.current);
    addAlert('warn', 'Demo manually aborted.');
    setDemoState('safe');
    setAmbulanceStatus(null);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, []);

  return (
    <section className="section" id="demo">
      <div className="container">
        <div className="section-header">
          <div className="section-badge laws-badge" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>Live Sensor Feed</div>
          <h2 className="section-title">Emergency Response Sandbox</h2>
          <p className="section-desc">Test the AI crash detection and Auto-Alert system right in your browser. Simulates phone gyro and GPS sensors reacting to an accident.</p>
        </div>

        <div className="demo-dashboard">
          {/* Left Column - Map & Feeds */}
          <div className="dash-left">
            <div className="real-map-container">
              <MapComponent 
                gps={gps} 
                demoState={demoState} 
                stepRef={stepRef}
                ambulanceStatus={ambulanceStatus}
              />
            </div>

            <div className="sensor-feed">
              <div className="sensor-title">ON-DEVICE EDGE SENSORS</div>
              <div className="sensor-rows">
                <div className="sensor-row">
                  <span className="sensor-name">Accelerometer (G)</span>
                  <span className="sensor-val">{demoState === 'danger' && stepRef.current >= 45 ? '4.8G' : '1.0G'}</span>
                </div>
                <div className="sensor-row">
                  <span className="sensor-name">Gyroscope (X,Y,Z)</span>
                  <span className="sensor-val" style={{ color: demoState === 'danger' ? 'var(--danger)' : 'var(--legal)' }}>
                    {gyro.x}, {gyro.y}, {gyro.z}
                  </span>
                </div>
                <div className="sensor-row">
                  <span className="sensor-name">GPS Location</span>
                  <span className="sensor-val">{gps.lat.toFixed(4)}N, {gps.lng.toFixed(4)}E</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Logs & Controls */}
          <div className="dash-right">
            <div className="alert-feed">
              <div className="alert-feed-title">AI SYSTEM LOGS</div>
              <div className="alerts-list">
                {alerts.map(a => (
                  <div key={a.id} className={`alert-item alert-${a.type}`}>
                    <span style={{opacity: 0.7}}>[{a.time}]</span> {a.msg}
                  </div>
                ))}
                <div ref={alertsEndRef} />
              </div>
            </div>

            <div className="demo-controls">
              <div className="ctrl-title">SIMULATION CONTROLS</div>
              <div className="ctrl-row">
                <span className="ctrl-label">Speed</span>
                <input type="range" className="ctrl-range" value={speed} readOnly min="0" max="150" />
                <span className="ctrl-val">{speed} km/h</span>
              </div>
              <div className="ctrl-btns">
                <button className="ctrl-btn start-btn" onClick={startDemo} disabled={isRunning}>▶ Start Crash Demo</button>
                <button className="ctrl-btn stop-btn" onClick={stopDemo} disabled={!isRunning}>⏹ Abort</button>
              </div>
            </div>

            {/* Dedicated Emergency & Ambulance Section */}
            {ambulanceStatus && (
              <div className="demo-controls" style={{ 
                marginTop: '1.5rem', 
                borderColor: 'rgba(255, 71, 87, 0.4)', 
                backgroundColor: 'rgba(255, 71, 87, 0.08)',
                boxShadow: '0 0 30px rgba(255, 71, 87, 0.15)',
                animation: 'fadeUp 0.4s ease-out'
              }}>
                <div className="ctrl-title" style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>🚨 EMERGENCY DISPATCH ACTIVE</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div className="ctrl-row" style={{ margin: 0 }}>
                    <span className="ctrl-label" style={{ minWidth: '100px', color: 'rgba(255,255,255,0.7)' }}>Hospital:</span>
                    <span className="ctrl-val" style={{ color: '#fff' }}>🏥 City Care Hospital (Apollo)</span>
                  </div>
                  <div className="ctrl-row" style={{ margin: 0 }}>
                    <span className="ctrl-label" style={{ minWidth: '100px', color: 'rgba(255,255,255,0.7)' }}>Distance:</span>
                    <span className="ctrl-val" style={{ color: '#fff' }}>1.2 km away</span>
                  </div>
                  <div className="ctrl-row" style={{ margin: 0 }}>
                    <span className="ctrl-label" style={{ minWidth: '100px', color: 'rgba(255,255,255,0.7)' }}>Status:</span>
                    <span className="ctrl-val" style={{ 
                        color: ambulanceStatus === 'arrived' ? 'var(--legal)' : '#ffa502',
                        fontWeight: '800',
                        fontSize: '0.95rem'
                      }}>
                      {ambulanceStatus === 'arrived' ? '🚑 ARRIVED AT SCENE' : '🚑 EN ROUTE (ETA: 3 Mins)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
