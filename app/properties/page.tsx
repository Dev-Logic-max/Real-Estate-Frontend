"use client";

import { useState, useEffect } from "react";
import Filters from "@/components/Filters";
import PropertyMap from "@/components/PropertyMap";
import { PropertyModel, Coordinates } from "@/types";
import { FaMapMarkerAlt } from "react-icons/fa";
import AutoImageSlider from "@/components/common/AutoImageSlider";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyModel[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyModel[]>([]);

  useEffect(() => {
    console.log("Start fetching Properties")
    fetch("/properties.json")
      .then((res) => res.json())
      .then((data: PropertyModel[]) => {
        console.log("Loaded properties:", data); // Debug log
        setProperties(data);
        setFilteredProperties(data);
      })
      .catch((error) => console.error("Error loading properties:", error));
  }, []);

  const handleFilter = (filters: {
    searchTerm: string;
    typeFilter: string;
    priceRange: [number, number];
    beds: number;
    baths: number;
    rooms: number;
    homeType: string;
  }) => {
    const { searchTerm, typeFilter, priceRange, beds, baths, rooms, homeType } = filters;
    const filtered = properties.filter((prop) => {
      const matchesSearch = prop.title
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) || false;
      const matchesType = typeFilter === "all" || prop.type === typeFilter;
      const matchesPrice =
        prop.price && prop.price >= priceRange[0] && prop.price <= priceRange[1];
      const matchesBeds = beds === 0 || (prop.bedrooms || 0) >= beds;
      const matchesBaths = baths === 0 || (prop.bathrooms || 0) >= baths;
      const matchesRooms =
        rooms === 0 || ((prop.bedrooms || 0) + (prop.bathrooms || 0)) >= rooms;
      const matchesHomeType = homeType === "all" || prop.propertyType === homeType;
      return (
        matchesSearch &&
        matchesType &&
        matchesPrice &&
        matchesBeds &&
        matchesBaths &&
        matchesRooms &&
        matchesHomeType
      );
    });
    setFilteredProperties(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Property Listings</h1>
      <Filters onFilter={handleFilter} />
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="w-full lg:w-1/2 space-y-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900">
                  {property.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  Price: ${property.price?.toLocaleString() || "N/A"}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {property.city}, {property.state}
                </p>
                <div className="w-full h-32 mt-4">
                  <AutoImageSlider
                    images={
                      property.images?.map((img) => ({
                        src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                        alt: property.title || "Property Image",
                      })) || []
                    }
                    height={128}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No properties found.</p>
          )}
        </div>
        <div className="w-full lg:w-1/2 h-[500px] lg:h-[calc(100vh-200px)]">
          <PropertyMap properties={filteredProperties} />
        </div>
      </div>
    </div>
  );
}