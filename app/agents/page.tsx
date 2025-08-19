"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
    FaSearch,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaStar,
    FaHome,
    FaDollarSign,
    FaChevronLeft,
    FaChevronRight,
    FaUserPlus,
    FaFilter,
    FaLanguage,
    FaBuilding,
    FaUsers,
    FaQuestionCircle,
    FaHandshake,
    FaAward,
    FaClock,
    FaShieldAlt,
    FaChartLine,
    FaComments,
    FaThumbsUp,
    FaGraduationCap,
    FaUserTie,
    FaHeadset,
} from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import agentsData from "@/json/public-agents.json"
import { PiPhoneCallDuotone } from "react-icons/pi"

interface Agent {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    profilePhoto: string
    bio: string
    license: string
    commissionRate: number
    rating: number
    reviewCount: number
    totalSales: number
    priceRange: string
    salesVolume: string
    avgPrice: string
    yearsExperience: number
    specialties: string[]
    languages: string[]
    serviceAreas: string[]
    status: string
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([])
    const [filteredAgents, setFilteredAgents] = useState<Agent[]>([])
    const [searchLocation, setSearchLocation] = useState("")
    const [searchAgent, setSearchAgent] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("all")
    const [selectedLanguage, setSelectedLanguage] = useState("all")
    const [priceRange, setPriceRange] = useState("all")
    const [experienceRange, setExperienceRange] = useState("all")
    const [ratingRange, setRatingRange] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const agentsPerPage = 5 // 2 agents + 1 contact card per row, multiple rows

    useEffect(() => {
        setAgents(agentsData)
        setFilteredAgents(agentsData)
    }, [])

    useEffect(() => {
        const filtered = agents.filter((agent) => {
            const matchesLocation =
                searchLocation === "" ||
                agent.serviceAreas.some((area) => area.toLowerCase().includes(searchLocation.toLowerCase()))

            const matchesAgent =
                searchAgent === "" || `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchAgent.toLowerCase())

            const matchesSpecialty =
                selectedSpecialty === "all" ||
                agent.specialties.some((specialty) => specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()))

            const matchesLanguage = selectedLanguage === "all" || agent.languages.includes(selectedLanguage)

            const matchesPriceRange =
                priceRange === "all" ||
                {
                    //   "under-300k": agent.avgPrice < 300000,
                    //   "300k-500k": agent.avgPrice >= 300000 && agent.avgPrice <= 500000,
                    //   "500k-1m": agent.avgPrice > 500000 && agent.avgPrice <= 1000000,
                    //   "over-1m": agent.avgPrice > 1000000,
                }[priceRange]

            const matchesExperienceRange =
                experienceRange === "all" ||
                {
                    "1-3": agent.yearsExperience >= 1 && agent.yearsExperience <= 3,
                    "3-5": agent.yearsExperience >= 3 && agent.yearsExperience <= 5,
                    "5-10": agent.yearsExperience >= 5 && agent.yearsExperience <= 10,
                    "10+": agent.yearsExperience > 10,
                }[experienceRange]

            const matchesRatingRange =
                ratingRange === "all" ||
                {
                    "4.5+": agent.rating >= 4.5,
                    "4.0+": agent.rating >= 4.0,
                    "3.5+": agent.rating >= 3.5,
                }[ratingRange]

            return (
                matchesLocation &&
                matchesAgent &&
                matchesSpecialty &&
                matchesLanguage &&
                matchesPriceRange &&
                matchesExperienceRange &&
                matchesRatingRange
            )
        })

        setFilteredAgents(filtered)
        setCurrentPage(1)
    }, [
        searchLocation,
        searchAgent,
        selectedSpecialty,
        selectedLanguage,
        priceRange,
        experienceRange,
        ratingRange,
        agents,
    ])

    const totalPages = Math.ceil(filteredAgents.length / agentsPerPage)
    const startIndex = (currentPage - 1) * agentsPerPage
    const currentAgents = filteredAgents.slice(startIndex, startIndex + agentsPerPage)

    const getSpecialtyColor = (specialty: string) => {
        const colors = {
            "Luxury Homes": "bg-gradient-to-r from-purple-500 to-pink-500",
            "First-Time Buyers": "bg-gradient-to-r from-green-500 to-blue-500",
            Commercial: "bg-gradient-to-r from-blue-500 to-indigo-500",
            "Investment Properties": "bg-gradient-to-r from-orange-500 to-red-500",
            Relocation: "bg-gradient-to-r from-teal-500 to-cyan-500",
            "Multi-Family": "bg-gradient-to-r from-yellow-500 to-orange-500",
        }
        return colors[specialty as keyof typeof colors] || "bg-gradient-to-r from-gray-500 to-gray-600"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-4 text-shadow-lg">Find Your Perfect Real Estate Agent</h1>
                    <p className="text-xl mb-8 text-blue-100">
                        Connect with trusted experts who know your local market inside and out
                    </p>
                    <div className="flex justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
                            <FaUsers className="text-yellow-300" />
                            <span className="text-lg font-semibold">{agents.length}+ Expert Agents</span>
                            <div className="w-px h-6 bg-white/30"></div>
                            <FaHome className="text-green-300" />
                            <span className="text-lg font-semibold">10,000+ Properties Sold</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="max-w-6xl mx-auto bg-white shadow-xl -mt-10 relative z-10 rounded-3xl border border-gray-100">
                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="relative group">
                            <FaMapMarkerAlt className="absolute left-5 top-1/2 transform -translate-y-1/2 text-blue-500 text-xl group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Enter city, neighborhood, or zip code"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="pl-14 h-16 text-lg border-2 border-blue-100 focus:border-blue-400 rounded-2xl bg-blue-50/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                            />
                        </div>
                        <div className="relative group">
                            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-500 text-xl group-focus-within:text-purple-600 transition-colors" />
                            <Input
                                placeholder="Search by agent name"
                                value={searchAgent}
                                onChange={(e) => setSearchAgent(e.target.value)}
                                className="pl-14 h-16 text-lg border-2 border-purple-100 focus:border-purple-400 rounded-2xl bg-purple-50/50 focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                            <SelectTrigger className="h-14 border-2 border-green-100 focus:border-green-400 rounded-2xl bg-green-50/50 hover:bg-green-50 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaBuilding className="text-green-500 text-lg" />
                                    <SelectValue placeholder="Specialty" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Specialties</SelectItem>
                                <SelectItem value="luxury">Luxury Homes</SelectItem>
                                <SelectItem value="first-time">First-Time Buyers</SelectItem>
                                <SelectItem value="commercial">Commercial</SelectItem>
                                <SelectItem value="investment">Investment Properties</SelectItem>
                                <SelectItem value="relocation">Relocation</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                            <SelectTrigger className="h-14 border-2 border-orange-100 focus:border-orange-400 rounded-2xl bg-orange-50/50 hover:bg-orange-50 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaLanguage className="text-orange-500 text-lg" />
                                    <SelectValue placeholder="Language" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Languages</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="Mandarin">Mandarin</SelectItem>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="Korean">Korean</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger className="h-14 border-2 border-pink-100 focus:border-pink-400 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaDollarSign className="text-pink-500 text-lg" />
                                    <SelectValue placeholder="Price Range" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="under-300k">Under $300K</SelectItem>
                                <SelectItem value="300k-500k">$300K - $500K</SelectItem>
                                <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                                <SelectItem value="over-1m">Over $1M</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={experienceRange} onValueChange={setExperienceRange}>
                            <SelectTrigger className="h-14 border-2 border-indigo-100 focus:border-indigo-400 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaClock className="text-indigo-500 text-lg" />
                                    <SelectValue placeholder="Experience" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Experience</SelectItem>
                                <SelectItem value="1-3">1-3 Years</SelectItem>
                                <SelectItem value="3-5">3-5 Years</SelectItem>
                                <SelectItem value="5-10">5-10 Years</SelectItem>
                                <SelectItem value="10+">10+ Years</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={ratingRange} onValueChange={setRatingRange}>
                            <SelectTrigger className="h-14 border-2 border-teal-100 focus:border-teal-400 rounded-2xl bg-teal-50/50 hover:bg-teal-50 transition-all duration-300">
                                <div className="flex items-center gap-3">
                                    <FaStar className="text-teal-500 text-lg" />
                                    <SelectValue placeholder="Rating" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                                <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                                <SelectItem value="3.5+">3.5+ Stars</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button className="h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <FaFilter className="mr-2 text-lg" />
                            Search Agents
                        </Button>
                    </div>
                </div>
            </section>

            {/* Results Count */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between">
                    <p className="text-xl text-gray-700">
                        <span className="font-bold text-blue-600 text-2xl">{filteredAgents.length}</span> expert agents found in
                        your area
                    </p>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FaFilter className="text-blue-500" />
                        <span className="text-sm">Sorted by: Top Rated</span>
                    </div>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 pb-12">
                <div className="grid md:grid-cols-2 gap-8">
                    {currentAgents.slice(0, 2).map((agent) => (
                        <Card
                            key={agent.id}
                            className="group p-0 hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-3xl overflow-hidden transform hover:scale-[1.020]"
                        >
                            <CardContent className="p-0">
                                <div className="flex">
                                    {/* Left side - Agent photo and rating */}
                                    <div className="w-40">
                                        <div className="h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center transition-all">
                                            <Image
                                                src={agent.profilePhoto || "/placeholder.svg"}
                                                alt={`${agent.firstName} ${agent.lastName}`}
                                                width={120}
                                                height={120}
                                                className="rounded-full border-4 border-white shadow-md"
                                            />
                                        </div>
                                    </div>

                                    {/* Right side - Agent details */}
                                    <div className="flex-1 p-4 relative">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {agent.firstName} {agent.lastName}
                                        </h3>
                                        <p className="text-gray-600 text-xs mb-4 line-clamp-2">{agent.bio}</p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex gap-2 justify-center items-center px-4 py-1 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                                <span className="text-base font-bold text-green-600">{agent.priceRange}</span>
                                                <span className="text-xs text-gray-600 font-medium">Price Range</span>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center px-4 py-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                                <span className="text-base font-bold text-blue-600">{agent.totalSales}</span>
                                                <span className="text-xs text-gray-600 font-medium">Sales in Itlay</span>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {agent.specialties.slice(0, 2).map((specialty, index) => (
                                                    <Badge
                                                        key={index}
                                                        className={`${getSpecialtyColor(specialty)} text-white text-[10px] px-2 py-1 rounded-full`}
                                                    >
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        {/* <div className="space-y-1 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaPhone className="text-blue-500" />
                                                <span>{agent.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaEnvelope className="text-purple-500" />
                                                <span className="truncate">{agent.email}</span>
                                            </div>
                                        </div> */}

                                        <span className="flex items-center gap-2 w-fit px-4 py-2 font-semibold rounded-xl shadow-sm hover:shadow-xl border hover:border-blue-300 transition-all duration-300 text-xs ms-auto">
                                            <PiPhoneCallDuotone className="w-6 h-6 text-green-400"/>
                                            Contact Agent
                                        </span>

                                        <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-100 to-purple-100 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-sm group-hover:shadow-md">
                                            <FaStar className="text-yellow-500 text-sm" />
                                            <span className="font-semibold text-sm">{agent.rating}</span>
                                            <span className="text-sm">({agent.reviewCount})</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl overflow-hidden transform hover:scale-105 md:col-span-2">
                        <CardContent className="p-0 h-full">
                            <div className="flex items-center h-full">
                                {/* Left side - Icon */}
                                <div className="w-48 flex-shrink-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                                        <FaHeadset className="text-white text-3xl" />
                                    </div>
                                </div>

                                {/* Right side - Content */}
                                <div className="flex-1 p-6">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Need Help Finding an Agent?</h3>
                                    <p className="text-gray-600 mb-4 leading-relaxed">
                                        Let our expert team match you with the perfect local agent based on your specific needs and
                                        preferences.
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-6 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaShieldAlt className="text-green-500" />
                                            <span>Verified & Licensed</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaChartLine className="text-blue-500" />
                                            <span>Top Performance</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaHandshake className="text-purple-500" />
                                            <span>Personalized Match</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaComments className="text-orange-500" />
                                            <span>24/7 Support</span>
                                        </div>
                                    </div>

                                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <FaUserTie className="mr-2" />
                                        Contact Local Agent
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {currentAgents.slice(2).map((agent) => (
                        <Card
                            key={agent.id}
                            className="group p-0 hover:shadow-2xl transition-all duration-500 border-0 bg-white rounded-3xl overflow-hidden transform hover:scale-[1.020]"
                        >
                            <CardContent className="p-0">
                                <div className="flex">
                                    {/* Left side - Agent photo and rating */}
                                    <div className="relative w-48 flex-shrink-0">
                                        <div className="h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
                                            <Image
                                                src={agent.profilePhoto || "/placeholder.svg"}
                                                alt={`${agent.firstName} ${agent.lastName}`}
                                                width={120}
                                                height={120}
                                                className="rounded-full border-4 border-white shadow-xl"
                                            />
                                        </div>
                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                                            <FaStar className="text-yellow-500 text-sm" />
                                            <span className="font-bold text-sm">{agent.rating}</span>
                                        </div>
                                    </div>

                                    {/* Right side - Agent details */}
                                    <div className="flex-1 p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            {agent.firstName} {agent.lastName}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{agent.bio}</p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="text-center p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                                                <div className="text-lg font-bold text-blue-600">{agent.totalSales}</div>
                                                <div className="text-xs text-gray-600 font-medium">Sales</div>
                                            </div>
                                            <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                                                <div className="text-sm font-bold text-green-600">{agent.salesVolume}</div>
                                                <div className="text-xs text-gray-600 font-medium">Volume</div>
                                            </div>
                                        </div>

                                        {/* Specialties */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1">
                                                {agent.specialties.slice(0, 2).map((specialty, index) => (
                                                    <Badge
                                                        key={index}
                                                        className={`${getSpecialtyColor(specialty)} text-white text-xs px-2 py-1 rounded-full`}
                                                    >
                                                        {specialty}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contact */}
                                        <div className="space-y-1 mb-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaPhone className="text-blue-500" />
                                                <span>{agent.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <FaEnvelope className="text-purple-500" />
                                                <span className="truncate">{agent.email}</span>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl h-10 shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                                            Contact Agent
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-full w-12 h-12 border-2 border-blue-200 hover:border-blue-500"
                        >
                            <FaChevronLeft />
                        </Button>

                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    onClick={() => setCurrentPage(page)}
                                    className={`rounded-full w-12 h-12 ${currentPage === page
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                            : "border-2 border-blue-200 hover:border-blue-500"
                                        }`}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-full w-12 h-12 border-2 border-blue-200 hover:border-blue-500"
                        >
                            <FaChevronRight />
                        </Button>
                    </div>
                )}
            </section>

            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Market Insights & Trends</h2>
                        <p className="text-xl text-gray-600">Stay informed with the latest real estate market data</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Average Home Price</h3>
                                <FaChartLine className="text-green-500 text-2xl" />
                            </div>
                            <div className="text-3xl font-bold text-green-600 mb-2">$485,000</div>
                            <div className="flex items-center text-sm text-green-600">
                                <span className="mr-1">↗</span>
                                <span>+5.2% from last month</span>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Days on Market</h3>
                                <FaClock className="text-blue-500 text-2xl" />
                            </div>
                            <div className="text-3xl font-bold text-blue-600 mb-2">28 Days</div>
                            <div className="flex items-center text-sm text-blue-600">
                                <span className="mr-1">↘</span>
                                <span>-3 days from last month</span>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Market Activity</h3>
                                <FaHome className="text-purple-500 text-2xl" />
                            </div>
                            <div className="text-3xl font-bold text-purple-600 mb-2">High</div>
                            <div className="flex items-center text-sm text-purple-600">
                                <span className="mr-1">●</span>
                                <span>Seller's market conditions</span>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Find Agents by Specialty</h2>
                        <p className="text-xl text-gray-600">Our agents specialize in different areas to serve you better</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[
                            { name: "Luxury Homes", icon: FaBuilding, color: "from-purple-500 to-pink-500", count: "45+" },
                            { name: "First-Time Buyers", icon: FaHome, color: "from-green-500 to-blue-500", count: "78+" },
                            { name: "Commercial", icon: FaBuilding, color: "from-blue-500 to-indigo-500", count: "32+" },
                            { name: "Investment", icon: FaDollarSign, color: "from-orange-500 to-red-500", count: "56+" },
                            { name: "Relocation", icon: FaMapMarkerAlt, color: "from-teal-500 to-cyan-500", count: "41+" },
                            { name: "Multi-Family", icon: FaUsers, color: "from-yellow-500 to-orange-500", count: "29+" },
                        ].map((specialty, index) => (
                            <Card
                                key={index}
                                className="text-center p-6 bg-white rounded-2xl shadow-lg border-0 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            >
                                <div
                                    className={`w-16 h-16 bg-gradient-to-br ${specialty.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <specialty.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800 mb-1">{specialty.name}</h3>
                                <p className="text-xs text-gray-600">{specialty.count} Agents</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Our Agents Section */}
            <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Agents?</h2>
                        <p className="text-xl text-gray-600">Experience the difference with our top-rated professionals</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaGraduationCap className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Expert Training</h3>
                            <p className="text-gray-600">Continuous education and market expertise</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaAward className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Proven Results</h3>
                            <p className="text-gray-600">Track record of successful transactions</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaComments className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Always available when you need us most</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaThumbsUp className="text-white text-2xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Client Satisfaction</h3>
                            <p className="text-gray-600">98% client satisfaction rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
                        <p className="text-xl text-gray-600">Real stories from satisfied homeowners</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600 text-sm">5.0 out of 5</span>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "Sarah helped us find our dream home in just 3 weeks. Her knowledge of the local market was incredible!"
                            </p>
                            <div className="flex items-center">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">Mike & Jennifer</p>
                                    <p className="text-sm text-gray-600">First-time Buyers</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600 text-sm">5.0 out of 5</span>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "Professional, responsive, and got us $20K over asking price. Couldn't be happier with the service!"
                            </p>
                            <div className="flex items-center">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">Robert Chen</p>
                                    <p className="text-sm text-gray-600">Home Seller</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white rounded-2xl shadow-lg border-0">
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600 text-sm">5.0 out of 5</span>
                            </div>
                            <p className="text-gray-700 mb-4 italic">
                                "The investment property analysis was spot-on. Made a great purchase thanks to their expertise!"
                            </p>
                            <div className="flex items-center">
                                <Image
                                    src="/placeholder.svg?height=40&width=40"
                                    alt="Client"
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">Lisa Rodriguez</p>
                                    <p className="text-sm text-gray-600">Property Investor</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Become an Agent Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <FaUserPlus className="text-6xl mb-6 mx-auto text-green-200" />
                    <h2 className="text-4xl font-bold mb-4">Ready to Join Our Team?</h2>
                    <p className="text-xl mb-8 text-green-100">
                        Become a licensed real estate agent and start building your career with us. We provide the tools, training,
                        and support you need to succeed.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/agents/register">
                            <Button className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                Register as Agent
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white hover:text-green-600 font-bold px-8 py-4 rounded-xl text-lg bg-transparent"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <FaQuestionCircle className="text-5xl text-blue-600 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600">Get answers to common questions about working with our agents</p>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1" className="border border-blue-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600">
                            How do I choose the right agent for me?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-4">
                            Consider factors like their experience in your area, specialties that match your needs, client reviews,
                            and communication style. Our platform makes it easy to compare agents and find the perfect match for your
                            real estate goals.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border border-blue-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600">
                            What services do real estate agents provide?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-4">
                            Our agents provide comprehensive services including market analysis, property search, negotiation,
                            contract management, inspection coordination, and closing assistance. They guide you through every step of
                            buying or selling your property.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border border-blue-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600">
                            How much do real estate agents charge?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-4">
                            Commission rates typically range from 2-3% of the sale price, but this can vary based on the agent and
                            services provided. Many agents offer flexible commission structures and will discuss their fees upfront
                            during your initial consultation.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border border-blue-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600">
                            Can I work with multiple agents?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-4">
                            While you can initially consult with multiple agents, it's best practice to work exclusively with one
                            agent once you've found the right fit. This ensures dedicated service and avoids conflicts of interest in
                            your transactions.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5" className="border border-blue-200 rounded-xl px-6">
                        <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-blue-600">
                            How long does it typically take to buy or sell a home?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 pt-4">
                            The timeline varies based on market conditions and your specific situation. Typically, selling takes 30-60
                            days from listing to closing, while buying can take 30-45 days from offer acceptance to closing. Your
                            agent will provide more specific timelines based on current market conditions.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    )
}
