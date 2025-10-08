"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { FaHome, FaBuilding, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCar, FaTimes } from "react-icons/fa"

import AutoImageSlider from "@/components/common/AutoImageSlider"
import { Property } from "@/types"
import { FaX } from "react-icons/fa6"
import { PiPhoneDuotone } from "react-icons/pi"

interface PropertyViewModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
}

export default function PropertyViewModal({ property, isOpen, onClose }: PropertyViewModalProps) {
  if (!property) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (propertyType: string) => {
    switch (propertyType) {
      case "villa":
      case "house":
        return <FaHome className="h-6 w-6 text-blue-500" />
      case "apartment":
        return <FaBuilding className="h-6 w-6 text-green-500" />
      case "office":
        return <FaBuilding className="h-6 w-6 text-purple-500" />
      default:
        return <FaHome className="h-6 w-6 text-gray-500" />
    }
  }

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-2">
          <DialogTitle className="text-2xl font-bold gradient-text-primary">Property Details</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer hover:bg-red-100">
            <FaX />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* 🖼️ Image Slider */}
          <div className="relative">
            <AutoImageSlider
              images={
                property.images?.map((img: string) => ({
                  src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                  alt: property.title,
                })) || []
              }
              height={400}
              className="w-full rounded-lg"
              interval={5000}
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={`capitalize ${getStatusColor(property.status)}`}>{property.status}</Badge>
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm capitalize">
                {property.type}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* 🏠 Overview Basic Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-3xl font-semibold text-gray-800">{property.title}</h3>
                <span className="my-auto">{getTypeIcon(property.propertyType || '')}</span>
              </div>
              <div className="text-3xl font-bold text-green-600">{formatPrice(property.price, property.type)}</div>

              {property.description && (
                <div className="border rounded-lg p-2 bg-gray-50">
                  <h4 className="text-lg text-shadow-sm font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              )}
            </div>

            {/* 🛏️ Property Features */}
            <div className="grid grid-cols-4 gap-4">
              {property.bedrooms && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                  <FaBed className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.bedrooms}</p>
                  </div>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                  <FaBath className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.bathrooms}</p>
                  </div>
                </div>
              )}
              {property.area && (
                <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
                  <FaRulerCombined className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Area</p>
                    <p className="font-semibold">{property.area} sq ft</p>
                  </div>
                </div>
              )}
              {property.parkingSpaces && (
                <div className="flex items-center space-x-2 p-3 bg-orange-50 rounded-lg">
                  <FaCar className="text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Parking</p>
                    <p className="font-semibold">{property.parkingSpaces} spaces</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 📍 Location */}
          <div className="border py-2 px-3 rounded-lg space-y-3 bg-gray-50">
            <h4 className="font-medium text-shadow-sm text-lg text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Location
            </h4>
            <div className="flex justify gap-12 text-sm">
              <div>
                <p className="text-shadow-sm text-gray-600">Address</p>
                <p className="font-medium">{property.address || "Not specified"}</p>
              </div>
              <div>
                <p className="text-shadow-sm text-gray-600">City, State</p>
                <p className="font-medium">
                  {property.city}, {property.state}
                </p>
              </div>
              <div>
                <p className="text-shadow-sm text-gray-600">Country</p>
                <p className="font-medium">{property.country}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 🧾 Details Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 border px-4 py-2 rounded-lg">
              <h4 className="font-medium text-gray-900">Property Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type:</span>
                  <span className="font-medium capitalize">{property.propertyType || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Purpose:</span>
                  <span className="font-medium capitalize">{property.purpose || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Furnished:</span>
                  <span className="font-medium">{property.isFurnished ? "Yes" : "No"}</span>
                </div>
                {property.heatingSystem && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heating:</span>
                    <span className="font-medium">{property.heatingSystem}</span>
                  </div>
                )}
                {property.coolingSystem && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cooling:</span>
                    <span className="font-medium">{property.coolingSystem}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 border px-4 py-2 rounded-lg">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium">{property.contactName || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{property.contactEmail || "Not specified"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{property.contactNumber || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 🌿 Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-shadow-sm text-gray-900">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* 🧑‍💼  Agents */}
          {property.agents && property.agents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 text-shadow-md">Assigned Agents</h4>
              <div className="space-y-3">
                {property.agents.map((agent, index) => (
                  <div key={index} className="flex justify-between gap-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <div className="flex items-center gap-4">
                      {agent.profilePhotos?.[0] ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_PICTURES_URL}${agent.profilePhotos?.[0]}`}
                          className="w-10 h-10 rounded-full object-cover border border-blue-400"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border border-blue-400 text-gray-600 bg-gradient-to-b from-purple-200 to-blue-400">
                          {`${agent.firstName?.[0]}${agent.lastName?.[0]}`.toUpperCase() || 'N/A'}
                        </div>
                      )}
                      <div>
                        <div className="flex gap-4">
                          <p className="text-lg font-medium text-blue-900 text-shadow-md">{agent.firstName} {agent.lastName}</p>
                          <div><Badge className={`capitalize ${getStatusColor(agent.status)}`}>{agent.status}</Badge></div>
                        </div>
                        <p className="text-sm text-green-600 text-shadow-md">
                          <span className="text-lg font-semibold text-gray-600">{agent.commissionRate}</span> % Commission
                        </p>
                      </div>
                    </div>
                    <div className="ms-auto my-auto">
                      <Button className="cursor-pointer rounded-xl border border-green-400 bg-green-50">
                        <PiPhoneDuotone /> Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
