import React, { useState, useEffect, useRef, useCallback } from "react";
import MapComponent from "./MapComponent";

const LawsRegulations = () => {
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

  const isSimulatingRef = useRef(false);

  // ✅ HARD FREEZE AFTER CRASH (MAIN FIX)
  const freezeRef = useRef(false);

  const directionRef = useRef({ lat: 0.0008, lng: 0.0006 });

  // AUTO SCROLL
  useEffect(() => {
    alertsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [alerts]);

  const addAlert = useCallback((type, msg) => {
    const time = new Date().toLocaleTimeString("en-IN", {
      hour12: false,
    });

    setAlerts((prev) => [
      ...prev.slice(-49),
      { id: Date.now(), type, time, msg },
    ]);
  }, []);

  // GPS (BLOCK WHEN SIM OR CRASH)
  useEffect(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        if (isSimulatingRef.current || freezeRef.current) return;

        const { latitude, longitude } = pos.coords;
        setGps({ lat: latitude, lng: longitude });
      },
      () => {
        if (!gps) setGps({ lat: 28.6139, lng: 77.209 });
      },
      { enableHighAccuracy: true },
    );

    return () => {
      if (watchIdRef.current)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [gps]);

  // AMBULANCE MOVEMENT
  const moveAmbulance = useCallback(() => {
    setAmbulancePos((prev) => {
      if (!prev || !gps) return prev;

      return {
        lat: prev.lat + (gps.lat - prev.lat) * 0.2,
        lng: prev.lng + (gps.lng - prev.lng) * 0.2,
      };
    });
  }, [gps]);

  // SIMULATION
  const simulateStep = useCallback(() => {
    if (freezeRef.current) return;

    stepRef.current += 1;
    const step = stepRef.current;

    // 🚗 movement
    setGps((prev) => {
      if (!prev || freezeRef.current) return prev;

      const speedFactor = speed / 10000;

      return {
        lat: prev.lat + directionRef.current.lat * speedFactor * 50,
        lng: prev.lng + directionRef.current.lng * speedFactor * 50,
      };
    });

    directionRef.current.lat += (Math.random() - 0.5) * 0.0001;
    directionRef.current.lng += (Math.random() - 0.5) * 0.0001;

    setGyro({
      x: (Math.random() * 0.1 - 0.05).toFixed(2),
      y: (Math.random() * 0.1 - 0.05).toFixed(2),
      z: (0.95 + Math.random() * 0.1).toFixed(2),
    });

    // ---------------- SPEED PHASES ----------------
    if (step < 20) {
      setSpeed((p) => Math.min(p + 2, 70));
    } else if (step === 20) {
      setDemoState("warn");
      addAlert("warn", "⚠️ Entering high-risk zone.");
      setSpeed(70);
    } else if (step < 40) {
      setSpeed(70);
    } else if (step === 40) {
      setDemoState("danger");
      addAlert("danger", "⚠️ Crash probability HIGH!");
      setSpeed((p) => Math.max(p - 12, 0));
    } else if (step < 50) {
      setSpeed((p) => Math.max(p - 12, 0));
    }

    // ---------------- CRASH ----------------
    else {
      if (!freezeRef.current) {
        freezeRef.current = true;

        setSpeed(0);
        setDemoState("danger");

        addAlert("danger", "💥 Crash detected!");
        setAmbulanceStatus("alerting");

        if (gps) {
          setAmbulancePos({
            lat: gps.lat + 0.03,
            lng: gps.lng + 0.03,
          });
        }

        // 🚑 SEQUENCE CONTROL (FIXED & RELIABLE)

        setTimeout(() => {
          setAmbulanceStatus("dispatched");
          addAlert("info", "🚑 Ambulance alerted");
        }, 2000);

        // 1️⃣ dispatched (after 2s)
        setTimeout(() => {
          setAmbulanceStatus("dispatched");
          addAlert("info", "🚑 Ambulance dispatched");
        }, 4000);

        // 2️⃣ on the way (after 4s)
        setTimeout(() => {
          setAmbulanceStatus("on the way");
          addAlert("info", "🚑 Ambulance is on the way...");
        }, 6000);

        // 3️⃣ moving animation (after 4–7s window)
        setTimeout(() => {
          const interval = setInterval(() => {
            moveAmbulance();
          }, 700);

          // stop movement after 7s
          setTimeout(() => clearInterval(interval), 7000);
        }, 4000);

        // 4️⃣ arrived (after 9s)
        setTimeout(() => {
          setAmbulanceStatus("arrived");
          addAlert("safe", "✅ Ambulance reached accident site");
        }, 9000);

        // 5️⃣ end demo (after 12s)
        setTimeout(() => {
          clearInterval(simInterval.current);
          setIsRunning(false);
          addAlert("safe", "🚀 Demo ended. Stay safe on the roads!");
          isSimulatingRef.current = false;
        }, 12000);
      }
    }
  }, [gps, speed, moveAmbulance, addAlert]);

  // START
  const startDemo = () => {
    if (isRunning) return;

    freezeRef.current = false; // ✅ RESET CRASH STATE
    isSimulatingRef.current = true;

    setIsRunning(true);
    setDemoState("safe");
    setAmbulanceStatus(null);
    setAmbulancePos(null);
    setSpeed(45);
    stepRef.current = 0;

    addAlert("info", "🚀 Demo started");

    clearInterval(simInterval.current);
    simInterval.current = setInterval(simulateStep, 700);
  };

  // STOP
  const stopDemo = () => {
    isSimulatingRef.current = false;

    setIsRunning(false);
    clearInterval(simInterval.current);
    addAlert("warn", "⛔ Demo stopped");
  };

  useEffect(() => {
    return () => clearInterval(simInterval.current);
  }, []);

  return (
    <section className="section" id="demo">
      <div className="container">
        <h2 className="section-title">Live Emergency Demo</h2>

        <div className="demo-dashboard">
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

          <div className="dash-right">
            <div className="alerts-list">
              {alerts.map((a) => (
                <div key={a.id} className={`alert-item ${a.type}`}>
                  [{a.time}] {a.msg}
                </div>
              ))}
              <div ref={alertsEndRef} />
            </div>

            <div
              className="ctrl-btns"
              style={{ display: "flex", gap: "12px", marginTop: "16px" }}
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

export default LawsRegulations;
