"use client"

import { useState } from "react"
import { FiMapPin, FiMenu, FiSearch } from "react-icons/fi";

export default function HeroSearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg shadow-purple-600/25">
        <div className="relative flex items-center">
          <div
            className={`absolute left-4 flex items-center space-x-2 transition-all duration-300 ease-in-out ${
              isFocused ? "opacity-100" : "opacity-100"
            }`}
          >
            {/* <FiSearch className="w-6 h-6 text-gray-400" /> */}
            <FiMapPin
                className={`w-5 h-5 text-gray-400 transition-opacity duration-300 ${
                  isFocused ? "opacity-100" : "opacity-100"
                }`}
              />
          </div>
          <input
            type="text"
            placeholder={isFocused ? "Calgary and Area, Alberta" : "Search by location, property type, or price range..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(searchQuery.length > 0)}
            className={`w-full py-3 text-lg border-2 border-gray-200 text-blue-800 font-semibold rounded-xl focus:ring-3 focus:ring-blue-600/60 focus:border-transparent transition-all duration-300 ease-in-out ${
              isFocused ? "pl-16 pr-32" : "pl-12 pr-12"
            }`}
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary text-white px-8 py-2 rounded-lg font-medium hover:shadow-glow transition-all flex items-center space-x-2 gradient-primary shadow-gradient-pink">
            <FiSearch className="w-5 h-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Conditional Recommendations */}
        {searchQuery.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in duration-300">
            <span className="text-sm text-gray-600">Suggestions:</span>
            {["Chicago", "New York", "Los Angeles", "Miami", "Luxury Homes"]
              .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setSearchQuery(suggestion)}
                  className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
