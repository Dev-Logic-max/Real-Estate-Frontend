"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FaPlus, FaTrash } from "react-icons/fa"
import { PiBuildingApartmentDuotone } from "react-icons/pi"
import { FiX } from "react-icons/fi"
import { Property } from "@/types"
import AutoImageSlider from "../common/AutoImageSlider"
import { toast } from "react-toastify"
import { propertyApi } from "@/lib/api/property"

interface PropertyEditModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onSave: (property: Partial<Property>) => void
}

export default function PropertyEditModal({ property, isOpen, onClose, onSave }: PropertyEditModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null) // For previewing uploaded image
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newAmenity, setNewAmenity] = useState("")
  const [formData, setFormData] = useState<Partial<Property>>({
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
  })

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
      })
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
      })
    }
  }, [property])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => {
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

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // console.log("Submitting formData before save:", formData) // Debug log before save
    if (!formData.images || formData.images.length === 0) {
      toast.warning("Images array is empty")
      console.warn("Images array is empty or undefined, check state update")
    }
    onSave(formData)
    onClose()
  }

  if (!isOpen) return null

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
          <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
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
            <Label htmlFor="imageUpload">Upload New Image</Label>
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
                className="flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" /> Upload Image
              </Button>
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter property title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number(e.target.value))}
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e: any) => handleInputChange("description", e.target.value)}
                placeholder="Enter property description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Listing Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms || ""}
                  onChange={(e) => handleInputChange("bedrooms", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms || ""}
                  onChange={(e) => handleInputChange("bathrooms", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Area (sq ft)</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area || ""}
                  onChange={(e) => handleInputChange("area", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parkingSpaces">Parking Spaces</Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces || ""}
                  onChange={(e) => handleInputChange("parkingSpaces", Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFurnished"
                checked={formData.isFurnished}
                onCheckedChange={(checked) => handleInputChange("isFurnished", checked)}
              />
              <Label htmlFor="isFurnished">Property is furnished</Label>
            </div>
          </div>

          <Separator />

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter full address"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  placeholder="Enter contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Availability</h3>
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From</Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom instanceof Date ? formData.availableFrom.toISOString().split("T")[0] : ""}
                onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                placeholder="Select available date"
              />
            </div>
          </div>

          <Separator />

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
            <div className="flex gap-2">
              <Input
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
              />
              <Button type="button" onClick={handleAddAmenity} variant="outline">
                <FaPlus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity, index) => (
                <Badge key={index} variant="outline" className="px-3 py-2 gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 transition-all">
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
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-white">
              {property ? "Update Property" : "Create Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
