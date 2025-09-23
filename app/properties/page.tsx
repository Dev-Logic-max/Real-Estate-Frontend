"use client";

import { useState, useEffect } from "react";

import { FaMapMarkerAlt } from "react-icons/fa";

import AutoImageSlider from "@/components/common/AutoImageSlider";
import MapboxProperties from "@/components/map/MapboxProperties";
import Filters from "@/components/Filters";

import { propertyApi } from "@/lib/api/property";
import { toast } from "react-toastify";
import { Property } from "@/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getApprovedProperties();
      setProperties(response.data.properties);
      setFilteredProperties(response.data.properties);
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  console.log("Properties passed to Mapbox:", filteredProperties);

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
      const matchesSearch =
        prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesType = typeFilter === "all" || prop.type === typeFilter;
      const matchesPrice =
        prop.price &&
        prop.price >= priceRange[0] &&
        prop.price <= priceRange[1];
      const matchesBeds = beds === 0 || (prop.bedrooms || 0) >= beds;
      const matchesBaths = baths === 0 || (prop.bathrooms || 0) >= baths;
      const matchesRooms =
        rooms === 0 ||
        ((prop.bedrooms || 0) + (prop.bathrooms || 0)) >= rooms;
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
        <div className="w-full lg:w-2/5 space-y-6">
          {loading ? (
            <p className="text-gray-500">Loading properties...</p>
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <div
                key={property._id}
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden group"
              >
                <div className="relative w-full h-48 mb-4">
                  <AutoImageSlider
                    images={
                      property.images?.map((img) => ({
                        src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                        alt: property.title || "Property Image",
                      })) || [
                        {
                          src: "/placeholder.jpg",
                          alt: "No Image Available",
                        },
                      ]
                    }
                    height={192}
                  />
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                    {property.type === "sale" ? "For Sale" : "For Rent"}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  Price: ${property.price?.toLocaleString() || "N/A"}{" "}
                  {property.type === "rent" && property.rentPeriod
                    ? `/${property.rentPeriod}`
                    : ""}
                </p>
                <p className="text-gray-600 flex items-center mb-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {property.city}, {property.state}, {property.country}
                </p>
                <div className="flex space-x-4 text-sm text-gray-700 mb-2">
                  <span>Bedrooms: {property.bedrooms || 0}</span>
                  <span>Bathrooms: {property.bathrooms || 0}</span>
                  <span>Area: {property.area || 0} sq ft</span>
                </div>
                {property.amenities!.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {property.amenities!.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-gray-500 text-sm">
                  Available From:{" "}
                  {property.availableFrom
                    ? new Date(property.availableFrom).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No properties found.</p>
          )}
        </div>
        <div className="w-full lg:w-3/5 h-[500px] lg:h-[calc(100vh-200px)]">
          <MapboxProperties properties={filteredProperties} />
        </div>
      </div>
    </div>
  );
}