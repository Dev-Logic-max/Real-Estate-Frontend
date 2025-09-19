import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ??
  "pk.eyJ1IjoiZGV2ZWxvcGVyMjAxMSIsImEiOiJjbWY1aDVjZjcwNHZ5MmpzOWJzemRxbTdwIn0.KRjhLUQmrVzzJB7uPAzilw";

type StyleKey = "streets" | "satellite" | "light" | "dark";

const STYLE_URLS: Record<StyleKey, string> = {
  streets: "mapbox://styles/mapbox/streets-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  light: "mapbox://styles/mapbox/light-v10",
  dark: "mapbox://styles/mapbox/dark-v10",
};

interface MapboxMapProps {
  latitude: number; // address lat
  longitude: number; // address lng
  zoom?: number;
  onCoordsChange?: (lat: number, lng: number) => void; // latest coords for API
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  latitude,
  longitude,
  zoom = 14,
  onCoordsChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const redMarkerRef = useRef<mapboxgl.Marker | null>(null); // address marker
  const blueMarkerRef = useRef<mapboxgl.Marker | null>(null); // custom marker

  const [styleKey, setStyleKey] = useState<StyleKey>("streets");
  const [is3D, setIs3D] = useState(false);
  const [pinMode, setPinMode] = useState(false);

  // Init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE_URLS[styleKey],
      center: [longitude, latitude],
      zoom,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.on("load", () => {
      // Red marker = address coords
      redMarkerRef.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([longitude, latitude])
        .addTo(map);

      // Inform parent initially (for form default)
      if (onCoordsChange) {
        onCoordsChange(latitude, longitude);
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      redMarkerRef.current = null;
      blueMarkerRef.current = null;
    };
  }, []);

  // Update red marker when new address entered
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.easeTo({ center: [longitude, latitude], duration: 800 });

    if (!redMarkerRef.current) {
      redMarkerRef.current = new mapboxgl.Marker({ color: "red" })
        .setLngLat([longitude, latitude])
        .addTo(map);
    } else {
      redMarkerRef.current.setLngLat([longitude, latitude]);
    }

    // If no blue marker, default coords = red marker
    if (!blueMarkerRef.current && onCoordsChange) {
      onCoordsChange(latitude, longitude);
    }
  }, [latitude, longitude]);

  // Change style
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    map.setStyle(STYLE_URLS[styleKey]);

    map.once("style.load", () => {
      if (redMarkerRef.current) redMarkerRef.current.addTo(map);
      if (blueMarkerRef.current) blueMarkerRef.current.addTo(map);
    });
  }, [styleKey]);

  // Toggle 3D
  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;

    if (is3D) {
      map.easeTo({ pitch: 0, bearing: 0, duration: 1000 });
      setIs3D(false);
    } else {
      map.easeTo({ pitch: 60, bearing: -17.6, duration: 1000 });
      setIs3D(true);
    }
  };

  // Enable pin mode
  const handleEnablePinMode = () => {
    setPinMode(true);
    toastMessage("Click anywhere on the map to drop a blue marker.");
  };

  // Handle click for blue marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      if (!pinMode) return;

      const { lng, lat } = e.lngLat;

      if (!blueMarkerRef.current) {
        blueMarkerRef.current = new mapboxgl.Marker({ color: "blue" })
          .setLngLat([lng, lat])
          .addTo(map);
      } else {
        blueMarkerRef.current.setLngLat([lng, lat]);
      }

      if (onCoordsChange) {
        onCoordsChange(lat, lng); // latest coords for form/API
      }

      setPinMode(false);
      toastMessage("Custom location pinned!");
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [pinMode, onCoordsChange]);

  // Simple toast helper
  const toastMessage = (msg: string) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.style.position = "absolute";
    el.style.bottom = "12px";
    el.style.left = "50%";
    el.style.transform = "translateX(-50%)";
    el.style.background = "rgba(0,0,0,0.75)";
    el.style.color = "white";
    el.style.padding = "6px 12px";
    el.style.borderRadius = "6px";
    el.style.fontSize = "13px";
    el.style.zIndex = "9999";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "360px" }}>
      {/* Left control panel */}
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: "rgba(255,255,255,0.9)",
          padding: 6,
          borderRadius: 8,
          boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
        }}
      >
        {(["streets", "satellite", "light", "dark"] as StyleKey[]).map((k) => (
          <button
            key={k}
            onClick={() => setStyleKey(k)}
            type="button"
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: styleKey === k ? "2px solid #2563eb" : "1px solid #ccc",
              background: styleKey === k ? "#eef2ff" : "white",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}

        <button
          onClick={toggle3D}
          type="button"
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: is3D ? "2px solid #2563eb" : "1px solid #ccc",
            background: is3D ? "#eef2ff" : "white",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {is3D ? "2D View" : "3D View"}
        </button>

        {/* Pin mode button */}
        <button
          onClick={handleEnablePinMode}
          type="button"
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: pinMode ? "2px solid #16a34a" : "1px solid #ccc",
            background: pinMode ? "#dcfce7" : "white",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {pinMode ? "Click on Map..." : "Refine Location"}
        </button>
      </div>

      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default MapboxMap;
