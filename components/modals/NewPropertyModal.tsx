"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FiX, FiHome, FiMapPin, FiDollarSign, FiUser } from "react-icons/fi"
import { toast } from "react-toastify"
import { propertyApi } from "@/lib/api/property"
import { AddProperty } from "@/types"
import { FaPlus, FaTrash } from "react-icons/fa"
import AutoImageSlider from "../common/AutoImageSlider"
import { Badge } from "../ui/badge"

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (propertyData: AddProperty) => void
}

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const [newAmenity, setNewAmenity] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    floorNumber: string;
    parkingSpaces: string;
    address: string;
    city: string;
    state: string;
    country: string;
    price: string;
    currency: string;
    amenities: string[];
    status: string;
    type: string;
    purpose: string;
    propertyType: string;
    contactName: string;
    contactEmail: string;
    contactNumber: string;
    availableFrom: string; // Changed to string initially
    rentPeriod: string;
    heatingSystem: string;
    coolingSystem: string;
    latitude: string;
    longitude: string;
    isFurnished: boolean;
    images: string[];
  }>({
    title: "",
    description: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    floorNumber: "",
    parkingSpaces: "",
    address: "",
    city: "",
    state: "",
    country: "",
    price: "",
    currency: "USD",
    amenities: [],
    status: "pending",
    type: "sale",
    purpose: "residential",
    propertyType: "apartment",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
    availableFrom: "",
    rentPeriod: "",
    heatingSystem: "",
    coolingSystem: "",
    latitude: "",
    longitude: "",
    isFurnished: false,
    images: [],
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) {
      toast.error("No file selected")
      return
    }

    const formDataToUpload = new FormData()
    Array.from(files).forEach((file) => formDataToUpload.append("files", file))

    try {
      const response = await propertyApi.uploadImage("temp-id", formDataToUpload) // Use temp-id, replace with real ID after create
      const newImages = response.data.image || []
      setFormData((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }))
      setPreviewImage(null)
      toast.success("Image uploaded successfully")
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleInputChange = (field: string, value: any) => {
    // setFormData((prev) => ({ ...prev, [field]: value }))
    setFormData((prev: any) => {
      if (field === "availableFrom") {
        return { ...prev, [field]: value } 
      }
      return { ...prev, [field]: value }
    })
  }

  const handleAmenitiesChange = (amenity: string) => {
    setFormData((prev: any) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a: any) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const propertyData: AddProperty = {
        ...formData,
        price: Number.parseFloat(formData.price) || 0,
        area: Number.parseFloat(formData.area) || 0,
        bedrooms: Number.parseInt(formData.bedrooms) || 0,
        bathrooms: Number.parseInt(formData.bathrooms) || 0,
        parkingSpaces: Number.parseInt(formData.parkingSpaces) || 0,
        floorNumber: Number.parseInt(formData.floorNumber) || 0,
        availableFrom: formData.availableFrom ? new Date(formData.availableFrom).toISOString() : undefined,
        ownerId: localStorage.getItem("userId") || "current-user-id", // Replace with actual user ID from auth (local storage)
        agents: [],

        // Include location only if both latitude and longitude are provided
        ...(formData.latitude && formData.longitude
          ? {
            location: {
              type: "Point",
              coordinates: [Number(formData.longitude), Number(formData.latitude)], // [longitude, latitude] order
            },
          }
          : {}),
      }

      // Validate required fields
      if (!propertyData.title || !propertyData.price || !propertyData.address) {
        toast.error("Title, price, and address are required.")
        return
      }

      // setPreviewImage(null)

      onAdd(propertyData); // Pass data to parent without API call
      // Reset form
      // setFormData({
      //   title: "",
      //   description: "",
      //   price: "",
      //   area: "",
      //   type: "sale",
      //   propertyType: "apartment",
      //   purpose: "residential",
      //   bedrooms: "",
      //   bathrooms: "",
      //   parkingSpaces: "",
      //   floorNumber: "",
      //   address: "",
      //   city: "",
      //   state: "",
      //   country: "",
      //   status: "pending",
      //   amenities: [],
      //   contactName: "",
      //   contactEmail: "",
      //   contactNumber: "",
      //   availableFrom: "",
      //   currency: "USD",
      //   rentPeriod: "",
      //   heatingSystem: "",
      //   coolingSystem: "",
      //   latitude: "",
      //   longitude: "",
      //   isFurnished: false,
      //   images: [],
      // })
      onClose();
    } catch (error) {
      console.error("Failed to add property:", error)
      toast.error("Failed to add property. Please try again.")
    }
  }

  const commonAmenities = [
    "Swimming Pool",
    "Gym",
    "Parking",
    "Garden",
    "Balcony",
    "Air Conditioning",
    "Heating",
    "Security",
    "Elevator",
    "Furnished",
    "Pet Friendly",
    "Internet",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-blue-200">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <FiHome className="text-blue-600" />
            Add New Property
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 hover:bg-red-100"
          >
            <FiX className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Image Gallery */}
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-blue-800">Property Images</h3>
          {formData.images.length > 0 ? (
            <>
              <AutoImageSlider
                images={formData.images.map((img) => ({
                  src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                  alt: formData.title || "Property Image",
                }))}
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
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiHome className="text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-blue-700 font-medium">
                  Property Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-blue-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 min-h-[100px]"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-blue-700 font-medium">
                  Listing Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="sale" className="hover:bg-blue-50">For Sale</SelectItem>
                    <SelectItem value="rent" className="hover:bg-blue-50">For Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="propertyType" className="text-blue-700 font-medium">
                  Property Type
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="apartment" className="hover:bg-amber-50">Apartment</SelectItem>
                    <SelectItem value="house" className="hover:bg-amber-50">House</SelectItem>
                    <SelectItem value="condo" className="hover:bg-amber-50">Condo</SelectItem>
                    <SelectItem value="townhouse" className="hover:bg-amber-50">Townhouse</SelectItem>
                    <SelectItem value="villa" className="hover:bg-amber-50">Villa</SelectItem>
                    <SelectItem value="office" className="hover:bg-amber-50">Office</SelectItem>
                    <SelectItem value="retail" className="hover:bg-amber-50">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Price and Details */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-blue-600" />
              Price & Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-blue-700 font-medium">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-blue-700 font-medium">
                  Area (sq ft)
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="currency" className="text-blue-700 font-medium">
                  Currency
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="USD" className="hover:bg-green-50">USD</SelectItem>
                    <SelectItem value="EUR" className="hover:bg-green-50">EUR</SelectItem>
                    <SelectItem value="GBP" className="hover:bg-green-50">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bedrooms" className="text-blue-700 font-medium">
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-blue-700 font-medium">
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="parkingSpaces" className="text-blue-700 font-medium">
                  Parking Spaces
                </Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-blue-700 font-medium">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-blue-700 font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-blue-700 font-medium">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-blue-700 font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Location Coordinates (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude" className="text-blue-700 font-medium">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={formData.latitude || ""}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="e.g., 37.7749"
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-blue-700 font-medium">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={formData.longitude || ""}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="e.g., -122.4194"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiUser className="text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contactName" className="text-blue-700 font-medium">
                  Contact Name
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-blue-700 font-medium">
                  Contact Email
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="contactNumber" className="text-blue-700 font-medium">
                  Contact Number
                </Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="availableFrom" className="text-blue-700 font-medium">
                  Available From
                </Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="rentPeriod" className="text-blue-700 font-medium">
                  Rent Period
                </Label>
                <Input
                  id="rentPeriod"
                  value={formData.rentPeriod}
                  onChange={(e) => handleInputChange("rentPeriod", e.target.value)}
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  placeholder="e.g., Monthly, Yearly"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          {/* <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {commonAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenitiesChange(amenity)}
                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div> */}

          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Amenities</h3>
            <div className="space-y-4">
              {/* Searchable Select for Common Amenities */}
              <Select
                value=""
                onValueChange={(value) => {
                  if (value && !formData.amenities.includes(value)) {
                    setFormData((prev: any) => ({
                      ...prev,
                      amenities: [...prev.amenities, value],
                    }));
                  }
                }}
              >
                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 w-full">
                  <SelectValue placeholder="Select or search amenities..." />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 overflow-auto">
                  {commonAmenities
                    .filter((amenity) =>
                      amenity.toLowerCase().includes(
                        (document.activeElement as HTMLInputElement)?.value?.toLowerCase() || ""
                      )
                    )
                    .map((amenity) => (
                      <SelectItem
                        key={amenity}
                        value={amenity}
                        className="hover:bg-amber-50"
                      >
                        {amenity}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Custom Amenity Input */}
              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  placeholder="Add custom amenity"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newAmenity.trim()) {
                      e.preventDefault();
                      if (!formData.amenities.includes(newAmenity.trim())) {
                        setFormData((prev: any) => ({
                          ...prev,
                          amenities: [...prev.amenities, newAmenity.trim()],
                        }));
                      }
                      setNewAmenity("");
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
                      setFormData((prev: any) => ({
                        ...prev,
                        amenities: [...prev.amenities, newAmenity.trim()],
                      }));
                      setNewAmenity("");
                    }
                  }}
                  variant="outline"
                >
                  <FaPlus className="w-4 h-4" />
                </Button>
              </div>

              {/* Display Selected Amenities */}
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="px-3 py-2 gap-2 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800 transition-all"
                  >
                    {amenity}
                    <span
                      className="cursor-pointer text-red-300 hover:text-red-600"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          amenities: prev.amenities.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      <FaTrash className="text-sm" />
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            >
              Add Property
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
