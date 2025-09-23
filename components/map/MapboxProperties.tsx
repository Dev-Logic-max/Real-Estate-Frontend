"use client";

import ReactDOM from "react-dom/client"; // ✅ React 18 way
import { useEffect, useRef, useState } from "react";

import "mapbox-gl/dist/mapbox-gl.css";
import "@/styles/mapbox-popup.css";
import mapboxgl from "mapbox-gl";

import AutoImageSlider from "@/components/common/AutoImageSlider";

import { FaRegHeart, FaShower } from "react-icons/fa";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { IoBedSharp } from "react-icons/io5";
import { LuLandPlot } from "react-icons/lu";
import { FiX } from "react-icons/fi";

import PropertyViewModal from "../modals/PropertyViewModal";
import { Property } from "@/types";

interface PropertyMapProps {
  properties: Property[];
}

export default function MapboxProperties({ properties }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const [styleId, setStyleId] = useState("mapbox://styles/mapbox/streets-v12");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔥 NEW: Different map style
  const mapStyles: { label: string; value: string }[] = [
    { label: "Streets", value: "mapbox://styles/mapbox/streets-v12" },
    { label: "Outdoors", value: "mapbox://styles/mapbox/outdoors-v12" },
    { label: "Satellite", value: "mapbox://styles/mapbox/satellite-streets-v12" },
  ];

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  // 🟢 Function to update property data
  const updatePropertyData = () => {
    if (!map.current || !mapLoaded) return;

    const source = map.current.getSource("properties") as mapboxgl.GeoJSONSource;
    if (!source) return;

    const geojson = {
      type: "FeatureCollection" as const,
      features: properties
        .filter((prop) => prop.location?.coordinates)
        .map((prop) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: prop.location!.coordinates as [number, number],
          },
          properties: { ...prop },
        })),
    };
    console.log("Proeprties data in the map", properties),

      source.setData(geojson);

    // Auto fit bounds if multiple properties
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      geojson.features.forEach((f) => bounds.extend(f.geometry.coordinates as [number, number]));
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }

  // 🟢 Function to add property source + layer
  const addPropertyLayer = () => {
    if (!map.current) return;

    setMapLoaded(true);

    // Add empty source initially
    map.current!.addSource("properties", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    // Add layer for properties (Circle Markers)
    map.current!.addLayer({
      id: "properties",
      type: "circle",
      source: "properties",
      paint: {
        "circle-radius": 8,
        "circle-color": "#007cbf",
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // Click handler for Markers (click → popup)
    map.current!.on("click", "properties", (e) => {
      const features = e.features;
      if (!features || !features.length) return;

      const feature = features[0];
      if (feature.geometry.type !== "Point") return;

      const coordinates = feature.geometry.coordinates as [number, number];
      const prop = feature.properties as any;

      if (popup.current) popup.current.remove();
      const popupNode = document.createElement("div");
      const root = ReactDOM.createRoot(popupNode);

      console.log("Type of prop.images:", typeof prop.images);
      console.log("Images before sent to the slider", prop.images)

      const baseUrl = process.env.NEXT_PUBLIC_PICTURES_URL || "http://localhost:3010/uploads";

      // Normalize images (parse if string)
      let normalizedImages: string[] = [];

      if (typeof prop.images === "string") {
        try {
          normalizedImages = JSON.parse(prop.images); // turn string → array
        } catch {
          normalizedImages = prop.images ? [prop.images] : [];
        }
      } else if (Array.isArray(prop.images)) {
        normalizedImages = prop.images;
      }

      const images = normalizedImages.length > 0
        ? normalizedImages.map((img: string) => ({
          src: `${baseUrl}${img}`,
          alt: prop.title || "Property image",
        }))
        : [{ src: "/placeholder.jpg", alt: "No image available" }];

      root.render(
        <div
          className="w-72 relative group p-1.5 border rounded-lg hover:border-blue-400 cursor-pointer"
          onClick={() => {
            // 🟢 Normalize images back to array
            let finalImages: string[] = [];
            if (typeof prop.images === "string") {
              try {
                finalImages = JSON.parse(prop.images);
              } catch {
                finalImages = prop.images ? [prop.images] : [];
              }
            } else if (Array.isArray(prop.images)) {
              finalImages = prop.images;
            }

            let finalAmenities: string[] = [];
            if (typeof prop.amenities === "string") {
              try {
                finalAmenities = JSON.parse(prop.amenities);
              } catch {
                finalAmenities = prop.amenities ? [prop.amenities] : [];
              }
            } else if (Array.isArray(prop.amenities)) {
              finalAmenities = prop.amenities;
            }

            let finalAgents: string[] = [];
            if (typeof prop.agents === "string") {
              try {
                finalAgents = JSON.parse(prop.agents);
              } catch {
                finalAmenities = prop.agents ? [prop.agents] : [];
              }
            } else if (Array.isArray(prop.agents)) {
              finalAgents = prop.agents;
            }

            // ✅ force array
            setSelectedProperty({
              ...prop,
              images: finalImages,
              agents: finalAgents,
              amenities: finalAmenities,
            });

            setIsModalOpen(true);
          }}
        >
          <button
            onClick={() => popup.current?.remove()}
            className="absolute top-2.5 right-2.5 z-20 bg-white/80 hover:bg-red-200 p-0.5 shadow-sm transition group-hover:block hidden w-5 h-5 rounded-xs cursor-pointer"
          >
            <FiX className="w-4 h-4 text-gray-700" />
          </button>

          <div className="absolute top-4 left-4 gap-2 z-20 flex flex-col">
            <FaRegHeart className="text-gray-600 hover:text-red-600 h-5 w-5" />
          </div>

          <AutoImageSlider
            images={images}
            height={180}
            className="rounded-lg w-full"
          />
          <div className="mt-2">
            <h3 className="text-lg font-semibold">{prop.title}</h3>
            <p className="text-xs text-gray-800 flex items-center gap-1 mt-0.5">
              <PiMapPinAreaDuotone className="text-red-600 h-4 w-4" /> {prop.address || "No address available"}
            </p>
            <p className="text-green-600 text-xl font-bold mt-2">
              $ {prop.price?.toLocaleString() || "N/A"}{" "}
              {prop.rentPeriod ? `/${prop.rentPeriod}` : ""}
            </p>
            <p className="text-xs text-gray-600 mt-2 py-2 flex items-center gap-1">
              <IoBedSharp className="text-blue-500 h-4 w-4" /> {prop.bedrooms || 0} Bed
              • <FaShower className="text-purple-500 h-4 w-4" /> {prop.bathrooms || 0} Bath
              •<LuLandPlot className="text-amber-500 h-4 w-4" /> {prop.area || 0} sqft
            </p>
          </div>
        </div>
      );

      popup.current = new mapboxgl.Popup({ offset: 25 })
        .setLngLat(coordinates)
        .setDOMContent(popupNode)
        .addTo(map.current!);
    });
  }

  // 🏙️ Toggle 3D Buildings
  const toggle3D = () => {
    if (!map.current) return;

    // Prevent duplicate
    if (map.current.getLayer("3d-buildings")) return;

    const layers = map.current.getStyle().layers;
    const labelLayerId = layers?.find(
      (l) => l.type === "symbol" && l.layout?.["text-field"]
    )?.id;

    map.current.addLayer(
      {
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId
    );
  };

  // 🗺️ Initialize Map
  useEffect(() => {
    if (!properties || properties.length === 0) return; // ⛔ wait for data
    if (!mapContainer.current || map.current) return;

    const initialCoordinates: [number, number] = properties.length > 0 && properties[0].location?.coordinates
      ? (properties[0].location.coordinates as [number, number])
      : [74.31418, 31.565607]; // Default to Lahore

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleId,
      center: initialCoordinates,
      zoom: 11,
      antialias: true,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
      addPropertyLayer();
      updatePropertyData();

      map.current!.on("mouseenter", "properties", () => {
        map.current!.getCanvas().style.cursor = "pointer";
      });

      map.current!.on("mouseleave", "properties", () => {
        map.current!.getCanvas().style.cursor = "";
      });
    });

    return () => {
      if (map.current) map.current.remove();
    };
  }, [properties]);

  // Update marker data whenever properties change
  useEffect(() => {
    if (mapLoaded) updatePropertyData();
  }, [properties, mapLoaded]);

  // 🔄 Style switcher
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(styleId);
    map.current.once("styledata", () => {
      if (mapLoaded) {
        // Re-add property layer after style change
        addPropertyLayer();
        updatePropertyData();
      }
    });
  }, [styleId]);

  return (
    <div className="w-full h-full relative">
      {/* 🔘 Controls */}
      <div className="absolute top-3 left-3 z-20 bg-white shadow p-2 rounded flex gap-2">
        <select
          value={styleId}
          onChange={(e) => setStyleId(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {mapStyles.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={toggle3D}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle 3D
        </button>
      </div>

      {/* 🗺️ Map */}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />

      {/* 📌 Property Modal */}
      {selectedProperty && (
        <PropertyViewModal
          property={selectedProperty}
          isOpen={true}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}
