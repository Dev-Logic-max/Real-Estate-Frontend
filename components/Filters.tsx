"use client";

import { useState } from "react";
import { FaSearch, FaFilter, FaSlidersH } from "react-icons/fa";

interface FiltersProps {
  onFilter: (filters: {
    searchTerm: string;
    typeFilter: string;
    priceRange: [number, number];
    beds: number;
    baths: number;
    rooms: number;
    homeType: string;
  }) => void;
}

export default function Filters({ onFilter }: FiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [homeType, setHomeType] = useState("all");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilter({
      searchTerm,
      typeFilter,
      priceRange,
      beds,
      baths,
      rooms,
      homeType,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by location or property name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <div className="flex-1">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
          >
            <option value="all">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
        <button
          onClick={handleApplyFilters}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md"
        >
          <FaFilter className="mr-2" /> Apply Filters
        </button>
        <button
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          <FaSlidersH className="mr-2" /> Advanced
        </button>
      </div>

      {isAdvancedOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range ($)
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([Number(e.target.value), priceRange[1]])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="range"
                min="0"
                max="2000000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <p className="text-sm text-gray-600 font-medium">
                ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-sm text-gray-600 font-medium">{beds}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={baths}
              onChange={(e) => setBaths(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-sm text-gray-600 font-medium">{baths}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Rooms
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-sm text-gray-600 font-medium">{rooms}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white pr-10"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="office">Office</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}