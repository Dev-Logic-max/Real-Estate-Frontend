"use client"

import { useState } from "react"
import { FaDollarSign, FaHome, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FiMapPin, FiMenu, FiSearch } from "react-icons/fi";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    <Input
                        placeholder="Search by location, property type, or price range..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
                    />
                </div>
                <Button className="h-12 px-8 gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink">
                    <FaSearch className="mr-2" />
                    Search
                </Button>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                    <FaHome className="mr-1 text-blue-500" />
                    Buy
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                >
                    <FaHome className="mr-1 text-green-500" />
                    Rent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                    <FaDollarSign className="mr-1 text-orange-500" />
                    Mortgage
                </Button>
            </div>
        </div>
    )
}
