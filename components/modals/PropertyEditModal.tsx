"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { FiAlignLeft, FiCalendar, FiCamera, FiCheckSquare, FiCrosshair, FiDollarSign, FiDroplet, FiEdit3, FiFlag, FiGlobe, FiHome, FiList, FiMail, FiMap, FiMapPin, FiNavigation, FiPhone, FiSearch, FiSettings, FiSquare, FiTag, FiThermometer, FiUpload, FiUser, FiWind, FiX } from "react-icons/fi"
import { FaCar, FaPlus, FaTrash } from "react-icons/fa"
import { PiBuildingApartmentDuotone } from "react-icons/pi"

import AutoImageSlider from "../common/AutoImageSlider"
import { propertyApi } from "@/lib/api/property"
import { agentApi } from "@/lib/api/agent"
import MapboxMap from "../map/MapboxMap"

import { toast } from "react-toastify"
import { Property } from "@/types"

interface AgentOption {
  userId: string
  firstName: string
  lastName: string
  status: string
  phone?: string
  commissionRate: number
  profilePhotos: string[]
}

interface PropertyEditModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onSave: (property: Partial<Property>) => void
}

export default function PropertyEditModal({ property, isOpen, onClose, onSave }: PropertyEditModalProps) {
  const [approvedAgents, setApprovedAgents] = useState<AgentOption[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null) // For previewing uploaded image
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newAmenity, setNewAmenity] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [formData, setFormData] = useState<Partial<Property>>({
    images: [],
    title: "",
    description: "",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    area: 0,
    floorNumber: 0,
    heatingSystem: "",
    coolingSystem: "",
    isFurnished: false,
    type: "sale",
    propertyType: "apartment",
    purpose: "residential",
    latitude: "",
    longitude: "",
    availableFrom: undefined,
    currency: "USD",
    rentPeriod: "",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    amenities: [],
    status: "pending",
    videos: [],
    views: "0",
    agents: [],
    listingDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const fetchApprovedAgents = async () => {
      try {
        const response = await agentApi.getApprovedAgents()
        console.log("Response of approved agents", response)

        const agentsArray = Array.isArray(response.data) ? response.data : [];
        const agents = agentsArray.map((item) => ({
          userId: item.user._id,
          status: item.agent.status,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          phone: item.agent.phone,
          commissionRate: item.agent.commissionRate,
          profilePhotos: item.user.profilePhotos,
        }))
        setApprovedAgents(agents)
      } catch (error) {
        toast.error("Failed to fectch approved agents")
      }
    }
    fetchApprovedAgents()
  }, [])

  // Sync formData with property prop when it changes
  useEffect(() => {
    if (property) {
      setFormData({
        _id: property._id,
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        area: property.area || 0,
        type: property.type || "sale",
        images: property.images || [],
        status: property.status || "pending",
        city: property.city || "",
        state: property.state || "",
        country: property.country || "",
        address: property.address || "",
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        propertyType: property.propertyType || "apartment",
        purpose: property.purpose || "residential",
        isFurnished: property.isFurnished || false,
        parkingSpaces: property.parkingSpaces || 0,
        floorNumber: property.floorNumber || 0,
        heatingSystem: property.heatingSystem || "",
        coolingSystem: property.coolingSystem || "",
        amenities: property.amenities || [],
        contactName: property.contactName || "",
        contactEmail: property.contactEmail || "",
        contactNumber: property.contactNumber || "",
        availableFrom: property.availableFrom || undefined,
        currency: property.currency || "USD",
        rentPeriod: property.rentPeriod || "",
        agents: property.agents || [],
        latitude: property.location?.coordinates[1]?.toString() || "", // Extract latitude
        longitude: property.location?.coordinates[0]?.toString() || "", // Extract longitude
      })
      // Set initial coordinates if location exists
      if (property.location?.coordinates) {
        setCoordinates({
          lat: property.location.coordinates[1],
          lng: property.location.coordinates[0],
        })
      }
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        area: 0,
        type: "sale",
        images: [],
        status: "pending",
        city: "",
        state: "",
        country: "",
        address: "",
        bedrooms: 0,
        bathrooms: 0,
        propertyType: "apartment",
        purpose: "residential",
        isFurnished: false,
        parkingSpaces: 0,
        floorNumber: 0,
        heatingSystem: "",
        coolingSystem: "",
        amenities: [],
        contactName: "",
        contactEmail: "",
        contactNumber: "",
        availableFrom: undefined,
        currency: "USD",
        rentPeriod: "",
        agents: [],
        latitude: "",
        longitude: "",
      })
      setCoordinates(null)
    }
  }, [property])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      if (field === "availableFrom" && value) {
        return { ...prev, [field]: new Date(value) } // Convert string to Date
      }
      return { ...prev, [field]: value }
    })
  }

  const handleAddAmenity = () => {
    if (newAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...(prev.amenities || []), newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !property?._id) {
      toast.error("No file selected or property ID missing")
      return
    }

    const formDataToUpload = new FormData()
    Array.from(files).forEach((file) => formDataToUpload.append("files", file))
    console.log("Uploading image for property ID:", property._id, "File:", Array.from(files).map(f => f.name)) // Debug log

    try {
      const response = await propertyApi.uploadImage(property._id, formDataToUpload) // Pass FormData with multiple files.
      const newImages = response.data.image || []
      setFormData((prev) => {
        const updatedImages = [...(prev.images || []), ...newImages]
        return { ...prev, images: updatedImages }
      })
      setPreviewImage(null) // Clear preview after successful upload
      toast.success("Image uploaded successfully")
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.response?.data?.message || error.message}`)
      console.error("Upload error:", error.response?.data || error.message)
    }
  }

  const handleRemoveImage = async (index: number) => {
    if (!property?._id || !formData.images?.[index]) {
      toast.error('Property or image not available for deletion');
      return;
    }

    try {
      await propertyApi.deleteImage(property._id, formData.images[index]);
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index) || [],
      }));
      toast.success('Image deleted successfully');
    } catch (error: any) {
      toast.error(`Failed to delete image: ${error.response?.data?.message || error.message}`);
      console.error('Delete image error:', error.response?.data || error.message);
    }
  };

  const handleAddAgent = (userId: string) => {
    const selectedAgent = approvedAgents.find(agent => agent.userId === userId)
    console.log("Selected Agent", selectedAgent)
    if (selectedAgent && !formData.agents?.some(agent => agent.agentId === userId)) {
      setFormData((prev: any) => ({
        ...prev,
        agents: [
          ...(prev.agents || []),
          {
            agentId: selectedAgent.userId,
            status: selectedAgent.status,
            phone: selectedAgent.phone,
            commissionRate: selectedAgent.commissionRate,
            firstName: selectedAgent.firstName,
            lastName: selectedAgent.lastName,
            // profilePhotos: selectedAgent.profilePhotos[0],
          },
        ],
      }))
    }
  }

  const handleRemoveAgent = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      agents: prev.agents?.filter(agent => agent.agentId !== userId) || [],
    }))
  }

  const handleFetchCoordinates = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error("Please enter a complete address (street, city, state, country).")
      return
    }

    try {
      const query = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
      )
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates
        setCoordinates({ lat, lng })
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),

          location: { type: "Point", coordinates: [lng, lat] },
        }))
        toast.success("Coordinates fetched successfully!")
      } else {
        toast.error("No coordinates found for the address.")
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error)
      toast.error("Failed to fetch coordinates. Please check your address or try again.")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // console.log("Submitting formData before save:", formData) // Debug log
    if (!formData.images || formData.images.length === 0) {
      toast.warning("Images array is empty")
      console.warn("Images array is empty or undefined, check state update")
    }

    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

  // Filter agents based on search term
  const filteredAgents = approvedAgents.filter(agent =>
    `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="flex flex-row items-center justify-between relative">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold gradient-text-primary">
            <PiBuildingApartmentDuotone className="w-10 h-10 text-green-600" />
            {property ? "Edit Property" : "Add New Property"}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-0 text-gray-500 bg-gray-100 hover:text-red-600 hover:bg-red-100 transition-colors"
          >
            <FiX className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {/* Image Gallery */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FiCamera className="h-5 w-5 text-orange-600" />
            Property Images
          </h3>
          {formData.images && formData.images.length > 0 ? (
            <>
              <AutoImageSlider
                images={
                  formData.images?.map((img: string) => ({
                    src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                    alt: formData.title || 'Property Images',
                  }))
                }
                height={200}
                className="w-full rounded-lg"
                interval={5000}
              />
              <div className="flex flex-wrap gap-4 mt-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`}
                      alt={`${formData.title || "Property"} Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-400 hover:border-gray-600"
                    />
                    <span
                      className="absolute -top-1 -right-1 text-white rounded-full p-1 group-hover:scale-110 bg-red-400 border border-red-600 group-hover:bg-red-500 hover:bg-red-600 group-hover:border-red-800"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTrash className="w-3 h-3 cursor-pointer" />
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No images uploaded yet.</p>
          )}
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="imageUpload" className="text-slate-700 font-medium flex items-center gap-2">
              <FiUpload className="h-4 w-4 text-blue-500" />
              Upload New Image
            </Label>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <FaPlus className="w-4 h-4" /> Upload Image
                </Button>
              </div>
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 p-0"
                    onClick={() => setPreviewImage(null)}
                  >
                    <FaTrash className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiHome className="h-5 w-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiEdit3 className="h-4 w-4 text-blue-500" />
                  Property Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter property title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4 text-green-500" />
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", Number(e.target.value))}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700 font-medium flex items-center gap-2">
                <FiAlignLeft className="h-4 w-4 text-purple-500" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 min-h-[120px] bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                placeholder="Describe your property..."
                rows={5}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiTag className="h-4 w-4 text-green-500" />
                  Listing Type *
                </Label>
                <Select value={formData.type || "sale"} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiCheckSquare className="h-4 w-4 text-orange-500" />
                  Status
                </Label>
                <Select value={formData.status || "pending"} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 bg-gradient-to-r from-orange-50/30 to-amber-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="propertyType" className="text-slate-700 font-medium flex items-center gap-2">
                  <PiBuildingApartmentDuotone className="h-4 w-4 text-indigo-500" />
                  Property Type
                </Label>
                <Select value={formData.propertyType || "apartment"} onValueChange={(value) => handleInputChange("propertyType", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 bg-gradient-to-r from-indigo-50/30 to-blue-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiSettings className="h-5 w-5 text-teal-600" />
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="bedrooms" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiSquare className="h-4 w-4 text-indigo-500" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) => handleInputChange("bedrooms", Number(e.target.value))}
                  className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 bg-gradient-to-r from-indigo-50/30 to-blue-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiDroplet className="h-4 w-4 text-cyan-500" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={(e) => handleInputChange("bathrooms", Number(e.target.value))}
                  className="border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 bg-gradient-to-r from-cyan-50/30 to-teal-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiMap className="h-4 w-4 text-rose-500" />
                  Area (sq ft)
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area || ""}
                  onChange={(e) => handleInputChange("area", Number(e.target.value))}
                  className="border-slate-200 focus:border-rose-400 focus:ring-rose-400 bg-gradient-to-r from-rose-50/30 to-pink-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="parkingSpaces" className="text-slate-700 font-medium flex items-center gap-2">
                  <FaCar className="h-4 w-4 text-violet-500" />
                  Parking Spaces
                </Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces || ""}
                  onChange={(e) => handleInputChange("parkingSpaces", Number(e.target.value))}
                  className="border-slate-200 focus:border-violet-400 focus:ring-violet-400 bg-gradient-to-r from-violet-50/30 to-purple-50/30"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <Checkbox
                id="isFurnished"
                checked={formData.isFurnished || false}
                onCheckedChange={(checked) => handleInputChange("isFurnished", checked)}
              />
              <Label htmlFor="isFurnished" className="text-emerald-700 font-medium flex items-center gap-2">
                <FiHome className="h-5 w-5" />
                Property is furnished
              </Label>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiMapPin className="h-5 w-5 text-red-600" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiMapPin className="h-4 w-4 text-red-500" />
                  Street Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border-slate-200 focus:border-red-400 focus:ring-red-400 bg-gradient-to-r from-red-50/30 to-rose-50/30"
                  placeholder="Enter street address"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiFlag className="h-4 w-4 text-blue-500" />
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiFlag className="h-4 w-4 text-green-500" />
                  State/Province *
                </Label>
                <Input
                  id="state"
                  value={formData.state || ""}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter state/Province"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiGlobe className="h-4 w-4 text-purple-500" />
                  Country *
                </Label>
                <Input
                  id="country"
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <Label htmlFor="floorNumber" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiSettings className="h-4 w-4 text-orange-500" />
                  Floor Number
                </Label>
                <Input
                  id="floorNumber"
                  type="number"
                  value={formData.floorNumber || ""}
                  onChange={(e) => handleInputChange("floorNumber", Number(e.target.value))}
                  className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 bg-gradient-to-r from-orange-50/30 to-amber-50/30"
                  placeholder="Floor number"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Button
                type="button"
                onClick={handleFetchCoordinates}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                <FiNavigation className="mr-2 h-4 w-4" />
                Fetch Coordinates
              </Button>
            </div>
            {coordinates && (
              <div className="md:col-span-2 rounded-xl overflow-hidden border border-gray-300 mt-4">
                <MapboxMap
                  latitude={coordinates.lat}
                  longitude={coordinates.lng}
                  onCoordsChange={(lat, lng) => {
                    setCoordinates({ lat, lng })
                    setFormData((prev) => ({
                      ...prev,
                      latitude: lat.toString(),
                      longitude: lng.toString(),
                      location: { type: "Point", coordinates: [lng, lat] },
                    }))
                    // toast.info("🗺️ Coordinates updated")
                    // toast.success("📍Custom location selected!")
                  }}
                />
              </div>
            )}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mt-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FiNavigation className="h-5 w-5" />
                GPS Coordinates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude" className="text-blue-700 font-medium flex items-center gap-2">
                    <FiCrosshair className="h-4 w-4" />
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    value={formData.latitude || ""}
                    onChange={(e) => handleInputChange("latitude", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                    placeholder="e.g., 40.7128"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="longitude" className="text-blue-700 font-medium flex items-center gap-2">
                    <FiCrosshair className="h-4 w-4" />
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    value={formData.longitude || ""}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                    placeholder="e.g., -74.0060"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUser className="h-5 w-5 text-purple-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-blue-500" />
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName || ""}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiMail className="h-4 w-4 text-green-500" />
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="contactNumber" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiPhone className="h-4 w-4 text-purple-500" />
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiCalendar className="h-5 w-5 text-green-600" />
              Availability
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availableFrom" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiCalendar className="h-4 w-4 text-green-500" />
                  Available From
                </Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom instanceof Date ? formData.availableFrom.toISOString().split("T")[0] : ""}
                  onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Select available date"
                />
              </div>
              <div>
                <Label htmlFor="purpose" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiHome className="h-4 w-4 text-teal-500" />
                  Purpose
                </Label>
                <Select value={formData.purpose || "residential"} onValueChange={(value) => handleInputChange("purpose", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-teal-400 focus:ring-teal-400 bg-gradient-to-r from-teal-50/30 to-cyan-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heatingSystem" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiThermometer className="h-4 w-4 text-rose-500" />
                  Heating System
                </Label>
                <Input
                  id="heatingSystem"
                  value={formData.heatingSystem || ""}
                  onChange={(e) => handleInputChange("heatingSystem", e.target.value)}
                  className="border-slate-200 focus:border-rose-400 focus:ring-rose-400 bg-gradient-to-r from-rose-50/30 to-pink-50/30"
                  placeholder="e.g., Central heating"
                />
              </div>
              <div>
                <Label htmlFor="coolingSystem" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiWind className="h-4 w-4 text-cyan-500" />
                  Cooling System
                </Label>
                <Input
                  id="coolingSystem"
                  value={formData.coolingSystem || ""}
                  onChange={(e) => handleInputChange("coolingSystem", e.target.value)}
                  className="border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 bg-gradient-to-r from-cyan-50/30 to-teal-50/30"
                  placeholder="e.g., Central AC"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Agents */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUser className="h-5 w-5 text-indigo-600" />
              Assigned Agents
            </h3>
            <div className="space-y-2">
              <Label htmlFor="agentSearch" className="text-slate-700 font-medium flex items-center gap-2">
                <FiSearch className="h-4 w-4 text-blue-500" />
                Search and Add Agent
              </Label>
              <Select onValueChange={handleAddAgent} value="">
                <SelectTrigger className="w-full border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 border-none focus:ring-0 p-0"
                    />
                  </div>
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-auto bg-white">
                  {filteredAgents.map((agent) => {
                    const initials = `${agent.firstName.charAt(0)}${agent.lastName.charAt(0)}`
                    const displayImage = agent.profilePhotos.length > 0
                      ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${agent.profilePhotos[0]}`
                      : undefined
                    return (
                      <SelectItem key={agent.userId} value={agent.userId} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                        {displayImage ? (
                          <img
                            src={displayImage}
                            alt={`${agent.firstName} ${agent.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                            {initials}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{`${agent.firstName} ${agent.lastName}`}</p>
                          <p className="text-sm text-gray-500">{`Commission: ${agent.commissionRate}%`}</p>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.agents?.map((agent) => {
                const matchedAgent = approvedAgents.find(a => a.userId === agent.agentId)
                if (!matchedAgent) return null
                const initials = `${matchedAgent.firstName.charAt(0)}${matchedAgent.lastName.charAt(0)}`
                const displayImage = matchedAgent.profilePhotos.length > 0
                  ? `${process.env.NEXT_PUBLIC_PICTURES_URL}${matchedAgent.profilePhotos[0]}`
                  : undefined
                return (
                  <Badge
                    key={agent.agentId}
                    variant="outline"
                    className="px-3 py-2 gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 transition-all"
                  >
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={`${matchedAgent.firstName} ${matchedAgent.lastName}`}
                        className="w-5 h-5 rounded-full object-cover mr-1"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold mr-1">
                        {initials}
                      </div>
                    )}
                    <span>{`${matchedAgent.firstName} ${matchedAgent.lastName}`}</span>
                    <span
                      className="cursor-pointer text-red-300 hover:text-red-600 ml-2"
                      onClick={() => handleRemoveAgent(agent.agentId)}
                    >
                      <FaTrash className="text-sm" />
                    </span>
                  </Badge>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiList className="h-5 w-5 text-green-600" />
              Amenities
            </h3>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
              />
              <Button type="button" onClick={handleAddAmenity} variant="outline" className="border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300">
                <FaPlus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity, index) => (
                <Badge key={index} variant="outline" className="px-3 py-2 gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-400 hover:text-green-800 transition-all">
                  {amenity}
                  <span
                    className="cursor-pointer text-red-300 hover:text-red-600"
                    onClick={() => handleRemoveAmenity(index)}
                  >
                    <FaTrash className="text-sm" />
                  </span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
              {property ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
