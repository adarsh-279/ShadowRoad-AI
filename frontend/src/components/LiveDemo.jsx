import React, { useState, useEffect, useRef, useCallback } from "react";
import MapComponent from "./MapComponent";

const LiveDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [demoState, setDemoState] = useState("safe");
  const [ambulanceStatus, setAmbulanceStatus] = useState(null);

  const [gps, setGps] = useState(null);
  const [ambulancePos, setAmbulancePos] = useState(null);

  const [speed, setSpeed] = useState(45);
  const [gyro, setGyro] = useState({ x: 0.02, y: -0.01, z: 0.98 });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "info",
      time: "10:00:01",
      msg: "System initialized. Fetching GPS location...",
    },
  ]);

  const simInterval = useRef(null);
  const stepRef = useRef(0);
  const watchIdRef = useRef(null);
  const alertsEndRef = useRef(null);

  // direction for smoother movement
  const directionRef = useRef({ lat: 0.0008, lng: 0.0006 });

  // ✅ AUTO SCROLL
  useEffect(() => {
    alertsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  // ✅ ADD ALERT
  const addAlert = useCallback((type, msg) => {
    const time = new Date().toLocaleTimeString("en-IN", {
      hour12: false,
    });

    setAlerts((prev) => [
      ...prev.slice(-49),
      { id: Date.now(), type, time, msg },
    ]);
  }, []);

  // ✅ LIVE GPS
  useEffect(() => {
    if (!navigator.geolocation) {
      addAlert("danger", "Geolocation not supported.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setGps({ lat: latitude, lng: longitude });
      },
      () => {
        addAlert("warn", "Using fallback location.");
        setGps({ lat: 28.6139, lng: 77.209 });
      },
      { enableHighAccuracy: true },
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [addAlert]);

  // ✅ MOVE AMBULANCE
  const moveAmbulance = useCallback(() => {
    setAmbulancePos((prev) => {
      if (!prev || !gps) return prev;

      const factor = 0.2;

      return {
        lat: prev.lat + (gps.lat - prev.lat) * factor,
        lng: prev.lng + (gps.lng - prev.lng) * factor,
      };
    });
  }, [gps]);

  // ✅ SIMULATION
  const simulateStep = useCallback(() => {
    stepRef.current += 1;
    const step = stepRef.current;

    // 🚗 SPEED-BASED MOVEMENT
    setGps((prev) => {
      if (!prev) return prev;

      // ❌ STOP movement if speed is 0 (after crash)
      if (speed <= 0) return prev;

      // ✅ movement scale based on speed
      const speedFactor = speed / 10000; // tweak this if needed

      return {
        lat: prev.lat + directionRef.current.lat * speedFactor * 50,
        lng: prev.lng + directionRef.current.lng * speedFactor * 50,
      };
    });

    // small random direction change
    directionRef.current.lat += (Math.random() - 0.5) * 0.0001;
    directionRef.current.lng += (Math.random() - 0.5) * 0.0001;

    // gyro
    setGyro({
      x: (Math.random() * 0.1 - 0.05).toFixed(2),
      y: (Math.random() * 0.1 - 0.05).toFixed(2),
      z: (0.95 + Math.random() * 0.1).toFixed(2),
    });

    if (step < 20) {
      setSpeed((prev) => Math.min(prev + 2, 70));
    } else if (step < 40) {
      setDemoState("warn");
      if (step === 20) addAlert("warn", "Entering high-risk zone.");
      setSpeed(70);
    } else if (step < 50) {
      setDemoState("danger");
      if (step === 40) addAlert("danger", "⚠️ Crash probability HIGH!");
      setSpeed((prev) => Math.max(prev - 12, 0));
    } else {
      // 🚨 CRASH PHASE
      setSpeed(0); // ✅ THIS NOW STOPS MOVEMENT PROPERLY

      if (step === 50 && gps) {
        addAlert("danger", "💥 Crash detected!");
        setAmbulanceStatus("alerting");

        setAmbulancePos({
          lat: gps.lat + 0.03,
          lng: gps.lng + 0.03,
        });
      }

      if (step === 55) {
        setAmbulanceStatus("dispatched");
        addAlert("info", "🚑 Ambulance dispatched");
      }

      if (step >= 55 && step < 70) {
        moveAmbulance();
      }

      if (step === 65) {
        setAmbulanceStatus("arrived");
        addAlert("safe", "✅ Ambulance arrived");
      }

      if (step > 70) {
        clearInterval(simInterval.current);
        setIsRunning(false);
      }
    }
  }, [gps, speed, moveAmbulance, addAlert]);

  // ✅ START
  const startDemo = () => {
    if (isRunning) return;

    setIsRunning(true);
    setDemoState("safe");
    setAmbulanceStatus(null);
    setAmbulancePos(null);
    setSpeed(45);
    stepRef.current = 0;

    addAlert("info", "🚀 Demo started");

    if (simInterval.current) clearInterval(simInterval.current);
    simInterval.current = setInterval(simulateStep, 700);
  };

  // ✅ STOP
  const stopDemo = () => {
    setIsRunning(false);
    if (simInterval.current) clearInterval(simInterval.current);
    addAlert("warn", "⛔ Demo stopped");
  };

  useEffect(() => {
    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, []);

  return (
    <section className="section" id="demo">
      <div className="container">
        <h2 className="section-title">Live Emergency Demo</h2>

        <div className="demo-dashboard">
          {/* LEFT */}
          <div className="dash-left">
            <div className="real-map-container">
              {gps ? (
                <MapComponent
                  gps={gps}
                  demoState={demoState}
                  ambulancePos={ambulancePos}
                />
              ) : (
                <div className="loading-box">📍 Fetching location...</div>
              )}
            </div>

            <div className="sensor-feed">
              <div className="sensor-row">
                <span>Speed</span>
                <span>{speed} km/h</span>
              </div>

              <div className="sensor-row">
                <span>GPS</span>
                <span>
                  {gps
                    ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`
                    : "Loading"}
                </span>
              </div>

              <div className="sensor-row">
                <span>Gyro</span>
                <span>
                  {gyro.x}, {gyro.y}, {gyro.z}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="dash-right">
            <div className="alerts-list">
              {alerts.map((a) => (
                <div key={a.id} className={`alert-item ${a.type}`}>
                  [{a.time}] {a.msg}
                </div>
              ))}
              <div ref={alertsEndRef} />
            </div>

            {/* 🔥 BETTER BUTTON UI */}
            <div
              className="ctrl-btns"
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={startDemo}
                disabled={isRunning}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  background: isRunning ? "#555" : "#22c55e",
                  color: "#fff",
                  cursor: isRunning ? "not-allowed" : "pointer",
                }}
              >
                ▶ Start Demo
              </button>

              <button
                onClick={stopDemo}
                disabled={!isRunning}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: "600",
                  background: !isRunning ? "#555" : "#ef4444",
                  color: "#fff",
                  cursor: !isRunning ? "not-allowed" : "pointer",
                }}
              >
                ⏹ Stop
              </button>
            </div>

            {ambulanceStatus && (
              <div className="ambulance-box">
                🚑 {ambulanceStatus.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
