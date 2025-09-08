"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AutoImageSlider from "./common/AutoImageSlider";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PropertyModel } from "@/types";

interface PropertyMapProps {
  properties: PropertyModel[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyModel | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiZGV2ZWxvcGVyMjAxMSIsImEiOiJjbWY1aDVjZjcwNHZ5MmpzOWJwemRxbTdwIn0.KRjhLUQmrVzzJB7uPAzilw";
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [74.3571, 31.5204],
        zoom: 10,
      });

      map.current.on("style.load", () => {
        map.current?.addSource("properties", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: properties
              .filter((prop) => prop.coordinates)
              .map((prop) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [
                    prop.coordinates!.lng,
                    prop.coordinates!.lat,
                  ] as [number, number],
                },
                properties: {
                  id: prop._id,
                  title: prop.title || "Unnamed Property",
                  price: prop.price,
                  images: prop.images || [],
                },
              })),
          },
        });

        map.current?.addLayer({
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

        map.current?.on("click", "properties", (e) => {
          const features = e.features;
          if (features && features.length > 0) {
            const feature = features[0];
            if (feature.geometry.type === "Point") {
              const coordinates = feature.geometry.coordinates as [number, number];
              const prop = properties.find((p) => p._id === feature.properties.id);
              if (prop && prop.coordinates) {
                if (popup.current) popup.current.remove();
                setSelectedProperty(prop); // Set the selected property
              }
            }
          }
        });

        map.current?.on("mouseenter", "properties", () => {
          map.current?.getCanvas().style.cursor = "pointer";
        });

        map.current?.on("mouseleave", "properties", () => {
          map.current?.getCanvas().style.cursor = "";
        });
      });
    }

    // Update map data when properties change
    if (map.current && properties.length > 0) {
      const source = map.current.getSource("properties") as mapboxgl.GeoJSONSource;
      if (source) {
        console.log("Updating map data with:", properties);
        source.setData({
          type: "FeatureCollection",
          features: properties
            .filter((prop) => prop.coordinates)
            .map((prop) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [
                  prop.coordinates!.lng,
                  prop.coordinates!.lat,
                ] as [number, number],
              },
              properties: {
                id: prop._id,
                title: prop.title || "Unnamed Property",
                price: prop.price,
                images: prop.images || [],
              },
            })),
        });
      } else {
        console.error("Source not found");
      }
    }
  }, [properties]);

  // Render property card when selected
  const renderPropertyCard = () => {
    if (!selectedProperty) return null;
    return (
      <div className="absolute top-4 right-4 w-80 bg-white p-4 rounded-lg shadow-lg z-10">
        <h3 className="text-lg font-bold">{selectedProperty.title}</h3>
        <p className="text-gray-600 mt-2">Price: ${selectedProperty.price?.toLocaleString() || "N/A"}</p>
        <p className="text-gray-600 flex items-center mt-1">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          {selectedProperty.city}, {selectedProperty.state}
        </p>
        <div className="w-full h-32 mt-4">
          <AutoImageSlider
            images={
              selectedProperty.images?.map((img) => ({
                src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                alt: selectedProperty.title || "Property Image",
              })) || []
            }
            height={128}
          />
        </div>
        <button
          onClick={() => setSelectedProperty(null)}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative" ref={mapContainer}>
      {renderPropertyCard()}
    </div>
  );
}