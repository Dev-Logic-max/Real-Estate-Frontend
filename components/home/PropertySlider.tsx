"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRuler, FaEye, FaShare, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import propertiesData from "@/json/properties.json"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: string
    location: string
    beds: number
    baths: number
    sqft: string
    images: { src: string; alt: string }[]
    type: "sale" | "rent"
    featured?: boolean
  }
}

function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group hover-lift overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white">
      <div className="relative">
        <AutoImageSlider images={property.images} className="h-64 w-full" objectFit="cover" />

        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            className={`${property.type === "sale" ? "bg-emerald-500 hover:bg-emerald-600" : "gradient-primary"} text-white shadow-lg`}
          >
            {property.type === "sale" ? "For Sale" : "For Rent"}
          </Badge>
          {property.featured && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg">Featured</Badge>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 transition-all duration-300 shadow-lg"
          >
            <FaShare />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 transition-all duration-300 shadow-lg"
          >
            <FaHeart />
          </Button>
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <span className="text-2xl font-bold gradient-text-primary">{property.price}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-4">
          <FaMapMarkerAlt className="text-red-500 mr-2" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
            <FaBed className="text-blue-600 mr-1" />
            <span className="font-medium">{property.beds} beds</span>
          </div>
          <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-lg">
            <FaBath className="text-emerald-600 mr-1" />
            <span className="font-medium">{property.baths} baths</span>
          </div>
          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
            <FaRuler className="text-amber-600 mr-1" />
            <span className="font-medium text-xs">{property.sqft}</span>
          </div>
        </div>

        <Button className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-lg">
          <FaEye className="mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default function PropertiesSlider() {
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const cities = ["Miami, FL", "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX"]
  const { properties } = propertiesData

  const itemsPerSlide = 3
  const totalSlides = Math.ceil(properties.length / itemsPerSlide)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [cities.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Animated heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Explore Houses in</span>{" "}
            <span
              className={`transition-all duration-500 ${
                currentCityIndex === 0
                  ? "text-blue-600"
                  : currentCityIndex === 1
                    ? "text-purple-600"
                    : currentCityIndex === 2
                      ? "text-teal-600"
                      : currentCityIndex === 3
                        ? "text-emerald-600"
                        : "text-orange-600"
              }`}
            >
              {cities[currentCityIndex]}
            </span>
          </h2>
          <p className="text-xl text-gray-600">Discover premium properties in the most sought-after locations</p>
        </div>

        {/* Properties slider */}
        <div className="relative">
          <Button
            onClick={prevSlide}
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-blue-600 shadow-lg border border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            <FaChevronLeft />
          </Button>

          <Button
            onClick={nextSlide}
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-blue-600 shadow-lg border border-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            <FaChevronRight />
          </Button>

          {/* Properties grid with smooth animation */}
          <div className="overflow-hidden px-16">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center space-x-2 mb-8 mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-blue-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button className="gradient-primary text-white px-8 py-3 text-lg hover:opacity-90 transition-all duration-300 shadow-gradient-blue">
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  )
}