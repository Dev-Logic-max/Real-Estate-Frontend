"use client";

import { useState, useEffect } from "react";

import { FaMapMarkerAlt } from "react-icons/fa";

import AutoImageSlider from "@/components/common/AutoImageSlider";
import MapboxProperties from "@/components/map/MapboxProperties";
import Filters from "@/components/layout/Filters";

import { propertyApi } from "@/lib/api/property";
import { toast } from "react-toastify";
import { Property } from "@/types";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: "",
    typeFilter: "all",
    priceRange: [0, 1000000] as [number, number],
    beds: 0,
    baths: 0,
    rooms: 0,
    homeType: "all",
  });

  useEffect(() => {
    fetchProperties(filters);
  }, []);

  const fetchProperties = async (appliedFilters: typeof filters) => {
    setLoading(true);
    try {
      const query: any = {}

      if (appliedFilters.typeFilter !== "all") {
        query.type = appliedFilters.typeFilter;
      }
      if (appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 1000000) {
        query.minPrice = appliedFilters.priceRange[0];
        query.maxPrice = appliedFilters.priceRange[1];
      }
      if (appliedFilters.beds > 0) {
        query.beds = appliedFilters.beds;
      }
      if (appliedFilters.baths > 0) {
        query.baths = appliedFilters.baths;
      }
      if (appliedFilters.rooms > 0) {
        query.rooms = appliedFilters.rooms;
      }
      if (appliedFilters.homeType !== "all") {
        query.homeType = appliedFilters.homeType;
      }
      
      const response = await propertyApi.getApprovedProperties(query);

      setProperties(response.data.properties);
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  return (
    <div className="container mx-auto h-[90vh] overflow-hidden">
      <div className="p-4 place-items-center h-[74px]">
        <Filters onFilter={handleFilter} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* LEFT COLUMN: Property Cards */}
        <div className="w-full lg:w-2/5 space-y-6 p-4 pb-12 mb-20 pt-0 overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading properties...</p>
          ) : properties.length > 0 ? (
            properties.map((property) => (
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

        {/* RIGHT COLUMN: MAP */}
        <div className="w-full lg:w-3/5 h-[500px] lg:h-[calc(90vh-80px)]">
          <MapboxProperties properties={properties} />
        </div>
      </div>
    </div>
  );
}