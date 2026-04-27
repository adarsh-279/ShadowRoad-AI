import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ gps, demoState, stepRef, ambulanceStatus }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const ambulanceMarker = useRef(null);
  const userCircle = useRef(null);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return; // Only initialize once

    if (mapContainer.current) {
      // Use live location if available, otherwise fallback to gps prop or default
      const initialLat = location?.lat || gps?.lat || 13.0827;
      const initialLng = location?.lng || gps?.lng || 80.2707;

      map.current = L.map(mapContainer.current).setView(
        [initialLat, initialLng],
        15,
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map.current);

      // Custom car icon
      const carIcon = L.divIcon({
        html: '<div style="font-size: 1.8rem; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">🚙</div>',
        iconSize: [30, 30],
        className: "custom-icon",
      });

      // Custom ambulance icon
      const ambulanceIcon = L.divIcon({
        html: '<div style="font-size: 1.8rem; transform: rotate(45deg); display: flex; align-items: center; justify-content: center; animation: pulse 1s infinite;">🚑</div>',
        iconSize: [30, 30],
        className: "custom-icon ambulance-icon",
      });

      // Add user marker
      userMarker.current = L.marker([initialLat, initialLng], {
        icon: carIcon,
      })
        .addTo(map.current)
        .bindPopup("Your Location");

      // Add accuracy circle
      userCircle.current = L.circle([initialLat, initialLng], {
        color: "#6c63ff",
        fillColor: "#6c63ff",
        fillOpacity: 0.1,
        radius: 50,
        weight: 1,
      }).addTo(map.current);
    }

    return () => {
      // Cleanup: don't destroy map on unmount to preserve state
    };
  }, [location, gps]);

  // Update map position based on GPS changes
  useEffect(() => {
    if (map.current && userMarker.current && gps) {
      const newLatLng = L.latLng(gps.lat, gps.lng);
      userMarker.current.setLatLng(newLatLng);

      // Update circle
      if (userCircle.current) {
        userCircle.current.setLatLng(newLatLng);
      }

      // Pan map to follow user
      map.current.panTo(newLatLng);

      // Add marker color based on demo state
      let markerColor = "#00d4aa"; // safe - green
      if (demoState === "warn") markerColor = "#ffa502"; // warn - orange
      if (demoState === "danger") markerColor = "#ff4757"; // danger - red

      userMarker.current.setIcon(
        L.divIcon({
          html: `<div style="font-size: 1.8rem; transform: rotate(-45deg) ${
            demoState === "danger" ? "scale(1.3)" : ""
          }; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 0 8px ${markerColor});">🚙</div>`,
          iconSize: [30, 30],
          className: "custom-icon",
        }),
      );

      // Update circle color based on state
      if (userCircle.current) {
        userCircle.current.setStyle({
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: demoState === "danger" ? 0.3 : 0.1,
          weight: demoState === "danger" ? 2 : 1,
        });
      }
    }
  }, [gps, demoState]);

  // Handle ambulance marker
  useEffect(() => {
    if (!map.current) return;

    if (ambulanceStatus) {
      if (!ambulanceMarker.current) {
        const ambulanceIcon = L.divIcon({
          html: '<div style="font-size: 1.8rem; display: flex; align-items: center; justify-content: center; animation: pulse 0.8s infinite;">🚑</div>',
          iconSize: [30, 30],
          className: "custom-icon ambulance-icon",
        });

        // Ambulance spawns from hospital location
        const hospitalLat = gps.lat - 0.01; // Hospital is slightly away
        const hospitalLng = gps.lng - 0.01;

        ambulanceMarker.current = L.marker([hospitalLat, hospitalLng], {
          icon: ambulanceIcon,
        })
          .addTo(map.current)
          .bindPopup("🏥 Ambulance - City Care Hospital");
      }

      // Update ambulance position based on status
      if (ambulanceMarker.current) {
        let ambulanceLat, ambulanceLng;

        if (ambulanceStatus === "arrived") {
          // Arrived at crash site
          ambulanceLat = gps.lat;
          ambulanceLng = gps.lng;
        } else if (ambulanceStatus === "dispatched") {
          // Moving towards crash site
          const progress = (stepRef.current - 52) / 13; // 13 steps for dispatch
          const startLat = gps.lat - 0.01;
          const startLng = gps.lng - 0.01;
          ambulanceLat =
            startLat + (gps.lat - startLat) * Math.min(progress, 1);
          ambulanceLng =
            startLng + (gps.lng - startLng) * Math.min(progress, 1);
        } else {
          // Alerting (hospital location)
          ambulanceLat = gps.lat - 0.01;
          ambulanceLng = gps.lng - 0.01;
        }

        ambulanceMarker.current.setLatLng([ambulanceLat, ambulanceLng]);
      }
    } else if (ambulanceMarker.current) {
      // Remove ambulance marker if status cleared
      map.current.removeLayer(ambulanceMarker.current);
      ambulanceMarker.current = null;
    }
  }, [ambulanceStatus, gps, stepRef]);

  // Request user's live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setError(null);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setError("Using simulated location");
          // Continue with simulated GPS data
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        },
      );
    }
  }, []);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      />
      {/* State Indicator */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          fontSize: "0.8rem",
          fontWeight: "600",
          color: "var(--primary)",
          fontFamily: "var(--mono)",
          backgroundColor: "rgba(10, 15, 30, 0.8)",
          padding: "0.5rem 0.75rem",
          borderRadius: "6px",
          border: "1px solid rgba(108, 99, 255, 0.3)",
          zIndex: 1000,
        }}
      >
        🗺️ LIVE MAP · {location ? "GPS ACTIVE" : "SIMULATED"}
      </div>

      {/* Demo State Indicator */}
      {demoState && (
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
            fontSize: "0.85rem",
            fontWeight: "700",
            zIndex: 1000,
            backgroundColor:
              demoState === "safe"
                ? "rgba(0, 212, 170, 0.15)"
                : demoState === "warn"
                  ? "rgba(255, 165, 2, 0.15)"
                  : "rgba(255, 71, 87, 0.15)",
            color:
              demoState === "safe"
                ? "var(--legal)"
                : demoState === "warn"
                  ? "var(--warn)"
                  : "var(--danger)",
            border:
              demoState === "safe"
                ? "1px solid rgba(0, 212, 170, 0.4)"
                : demoState === "warn"
                  ? "1px solid rgba(255, 165, 2, 0.4)"
                  : "1px solid rgba(255, 71, 87, 0.4)",
            animation:
              demoState === "danger"
                ? "dangerPulse 0.5s ease infinite"
                : "none",
          }}
        >
          {demoState === "safe" && "✓ Safe Route"}
          {demoState === "warn" && "⚠ High-Risk Zone"}
          {demoState === "danger" && "🚨 DANGER - SOS INITIATED"}
        </div>
      )}
    </div>
  );
};

export default MapComponent;
