"use client";

import { useEffect, useState, useRef } from "react";

import { FaSearch, FaFilter, FaSlidersH } from "react-icons/fa";
import { FcSearch } from "react-icons/fc";

import { Badge } from "../ui/badge";

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
  const [isSearching, setIsSearching] = useState(false)
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [homeType, setHomeType] = useState("all");

  const [room, setRoom] = useState(false);
  const [price, setPrice] = useState(false);

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false)
  const [isHomeModalOpen, setIsHomeModalOpen] = useState(false)
  const [isAdvanceFilterModaldOpen, setIsAdvanceFilterModalOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLDivElement>(null);
  const advanceRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeModalOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setIsPriceModalOpen(false);
      }
      if (roomRef.current && !roomRef.current.contains(event.target as Node)) {
        setIsRoomModalOpen(false);
      }
      if (homeRef.current && !homeRef.current.contains(event.target as Node)) {
        setIsHomeModalOpen(false);
      }
      if (advanceRef.current && !advanceRef.current.contains(event.target as Node)) {
        setIsAdvanceFilterModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm]);

  return (
    <div className="bg-white">
      <div className="flex gap-4 mb-6">
        <div className={`relative shadow-md shadow-blue-100 rounded-lg ${isSearching ? "w-96" : "w-72"} transition-all`} ref={searchRef}>
          {isSearching ? <FcSearch className="absolute w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> : <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
          <input
            type="text"
            placeholder={`${isSearching ? "Search by location or property name..." : "Search location..."}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearching(true)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        <div className="relative" ref={typeRef}>
          <Badge
            onClick={() => {
              setIsTypeModalOpen(!isTypeModalOpen)
              setIsPriceModalOpen(false);
              setIsRoomModalOpen(false);
              setIsHomeModalOpen(false);
              setIsAdvanceFilterModalOpen(false);
            }}
            className="px-4 py-3 border cursor-pointer border-gray-200 bg-gray-50 text-blue-950 hover:bg-blue-50 transition-all duration-200"
          >
            {typeFilter === "all" ? "Property Types" : typeFilter === "sale" ? "For Sale" : "For Rent"}
          </Badge>
          {isTypeModalOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { setTypeFilter("all"); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                All Types
              </button>
              <button
                onClick={() => { setTypeFilter("sale"); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                For Sale
              </button>
              <button
                onClick={() => { setTypeFilter("rent"); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                For Rent
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={priceRef}>
          <Badge
            onClick={() => {
              setIsPriceModalOpen(!isPriceModalOpen)
              setIsTypeModalOpen(false)
              setIsRoomModalOpen(false);
              setIsHomeModalOpen(false);
              setIsAdvanceFilterModalOpen(false);
            }}
            className="px-4 py-3 border cursor-pointer border-gray-200 bg-gray-50 text-blue-950 hover:bg-blue-50 transition-all duration-200"
          >
            {price ? `${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}` : "Price Range"}
          </Badge>
          {isPriceModalOpen && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Price</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    min="0"
                    max="2000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Price</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    min="0"
                    max="2000000"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <button
                  onClick={() => { setIsPriceModalOpen(false); setPrice(true); handleApplyFilters(); }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={roomRef}>
          <Badge
            onClick={() => {
              setIsRoomModalOpen(!isRoomModalOpen)
              setIsPriceModalOpen(false)
              setIsTypeModalOpen(false)
              setIsHomeModalOpen(false);
              setIsAdvanceFilterModalOpen(false);
            }}
            className="px-4 py-3 border cursor-pointer border-gray-200 bg-gray-50 text-blue-950 hover:bg-blue-50 transition-all duration-200"
          >
            {room ? "" : "Beds & Baths"}
          </Badge>
          {isRoomModalOpen && (
            <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
              <div className="space-y-4 h-64 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                  <input
                    type="number"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    min="0"
                    max="10"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={beds}
                    onChange={(e) => setBeds(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                  <input
                    type="number"
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    min="0"
                    max="10"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={baths}
                    onChange={(e) => setBaths(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Rooms</label>
                  <input
                    type="number"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                    min="0"
                    max="20"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={rooms}
                    onChange={(e) => setRooms(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                  />
                </div>
                <button
                  onClick={() => { setIsRoomModalOpen(false); setRoom(true); handleApplyFilters(); }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={homeRef}>
          <Badge
            onClick={() => {
              setIsHomeModalOpen(!isHomeModalOpen)
              setIsPriceModalOpen(false)
              setIsTypeModalOpen(false)
              setIsRoomModalOpen(false);
              setIsAdvanceFilterModalOpen(false);
            }}
            className="px-4 py-3 border cursor-pointer border-gray-200 bg-gray-50 text-blue-950 hover:bg-blue-50 transition-all duration-200"
          >
            {homeType === "all" ? "Home Type" : homeType}
          </Badge>
          {isHomeModalOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { setHomeType("all"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg"
              >
                All Types
              </button>
              <button
                onClick={() => { setHomeType("apartment"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Apartment
              </button>
              <button
                onClick={() => { setHomeType("house"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                House
              </button>
              <button
                onClick={() => { setHomeType("villa"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Villa
              </button>
              <button
                onClick={() => { setHomeType("office"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Office
              </button>
              <button
                onClick={() => { setHomeType("commercial"); setIsHomeModalOpen(false); handleApplyFilters(); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
              >
                Commercial
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={advanceRef}>
          <Badge
            onClick={() => setIsAdvanceFilterModalOpen(!isAdvanceFilterModaldOpen)}
            className="px-4 py-3 border cursor-pointer border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-200 transition-all duration-200"
          >
            <FaSlidersH className="mr-2" /> Advanced
          </Badge>
        </div>
      </div>

      {isAdvanceFilterModaldOpen && (
        <div className="absolute mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80">
          <div className="space-y-4 h-64 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range ($)</label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-sm text-gray-600 font-medium">
                  ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
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
            <button
              onClick={() => { setIsAdvanceFilterModalOpen(false); handleApplyFilters(); }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}