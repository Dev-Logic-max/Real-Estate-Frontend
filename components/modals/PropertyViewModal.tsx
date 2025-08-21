"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  FaHome,
  FaBuilding,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCar,
  FaTimes,
} from "react-icons/fa"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { Property } from "@/types"

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
        return <FaHome className="text-blue-500" />
      case "apartment":
        return <FaBuilding className="text-green-500" />
      case "office":
        return <FaBuilding className="text-purple-500" />
      default:
        return <FaHome className="text-gray-500" />
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
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold gradient-text-primary">Property Details</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <FaTimes className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Slider */}
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
              <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm capitalize">
                {property.type}
              </Badge>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
                {getTypeIcon(property.propertyType || '')}
              </div>
              <div className="text-3xl font-bold text-green-600">{formatPrice(property.price, property.type)}</div>

              {property.description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Property Features */}
              <div className="grid grid-cols-2 gap-4">
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
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-medium">{property.address || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-600">City, State</p>
                <p className="font-medium">
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                {property.floorNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-medium">{property.floorNumber}</span>
                  </div>
                )}
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

            <div className="space-y-4">
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

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Agents */}
          {property.agents && property.agents.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Assigned Agents</h4>
                <div className="space-y-3">
                  {property.agents.map((agent, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          {/* <p className="font-medium">{agent.name}</p> */}
                          <p className="text-sm text-gray-600">{agent.commissionRate}% commission</p>
                        </div>
                        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
