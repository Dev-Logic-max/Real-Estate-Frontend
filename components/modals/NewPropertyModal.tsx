"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FiX, FiHome, FiMapPin, FiDollarSign, FiUser, FiTag, FiAlignLeft, FiList, FiSquare, FiDroplet, FiMap, FiFlag, FiGlobe, FiCrosshair, FiMail, FiPhone, FiCalendar, FiClock, FiCheckSquare, FiPlus, FiImage, FiUpload } from "react-icons/fi"
import { toast } from "react-toastify"
import { propertyApi } from "@/lib/api/property"
import { AddProperty } from "@/types"
import { FaBed, FaBuilding, FaCar, FaCity, FaDollarSign, FaPlus, FaShower, FaTrash } from "react-icons/fa"
import AutoImageSlider from "../common/AutoImageSlider"
import { Badge } from "../ui/badge"
import { PiHouseLineDuotone } from "react-icons/pi"
import { IoIosPricetags } from "react-icons/io";
import { LuLandPlot } from "react-icons/lu";

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
    images: string[];
    title: string;
    description: string;
    price: string;
    bedrooms: string;
    bathrooms: string;
    parkingSpaces: string;
    area: string;
    floorNumber: string;
    heatingSystem: string;
    coolingSystem: string;
    isFurnished: boolean;
    type: string;
    propertyType: string;
    purpose: string;
    latitude: string;
    longitude: string;
    availableFrom: string;
    currency: string;
    rentPeriod: string;
    contactName: string;
    contactEmail: string;
    contactNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    amenities: string[];
    status: string;
    videos: string[];
    views: string;
    listingDate: string;
  }>({
    images: [],
    title: "",
    description: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    parkingSpaces: "",
    area: "",
    floorNumber: "",
    heatingSystem: "",
    coolingSystem: "",
    isFurnished: false,
    type: "sale",
    propertyType: "apartment",
    purpose: "residential",
    latitude: "",
    longitude: "",
    availableFrom: "",
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
    listingDate: new Date().toISOString().split("T")[0],
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
            <PiHouseLineDuotone className="h-8 w-8 text-green-600" />
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
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiImage className="text-indigo-600" />
            Property Images
          </h3>
          {formData.images.length > 0 ? (
            <>
              <AutoImageSlider
                images={formData.images.map((img) => ({
                  src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                  alt: formData.title || "Property Image",
                }))}
                height={200}
                className="w-full rounded-lg shadow-md"
                interval={5000}
              />
              <div className="flex flex-wrap gap-3 mt-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`}
                      alt={`${formData.title || "Property"} Image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:border-indigo-300 transition-all duration-200"
                    />
                    <span
                      className="absolute -top-2 -right-2 text-white rounded-full p-1 bg-red-500 border border-red-700 group-hover:bg-red-600 hover:bg-red-700 transition-all duration-200"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <FaTrash className="w-4 h-4 cursor-pointer" />
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">No images uploaded yet.</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="imageUpload" className="text-indigo-700 font-medium flex items-center gap-1">
              <FiUpload className="text-indigo-600" />
              Upload New Image
            </Label>
            <div className="flex gap-3 items-center">
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
                className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200"
              >
                <FaPlus className="w-4 h-4 text-indigo-600" /> Upload Image
              </Button>
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 p-0 shadow-md hover:bg-red-600 transition-all duration-200"
                    onClick={() => setPreviewImage(null)}
                  >
                    <FaTrash className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiHome className="text-indigo-600" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiTag className="text-indigo-600" />
                Property Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiAlignLeft className="text-indigo-600" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400 min-h-[120px]"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiList className="text-indigo-600" />
                Listing Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="sale" className="hover:bg-indigo-50 text-indigo-700">For Sale</SelectItem>
                  <SelectItem value="rent" className="hover:bg-indigo-50 text-indigo-700">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="propertyType" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaBuilding className="text-indigo-600" />
                Property Type
              </Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="apartment" className="hover:bg-amber-50 text-amber-700">Apartment</SelectItem>
                  <SelectItem value="house" className="hover:bg-green-50 text-green-700">House</SelectItem>
                  <SelectItem value="condo" className="hover:bg-blue-50 text-blue-700">Condo</SelectItem>
                  <SelectItem value="townhouse" className="hover:bg-purple-50 text-purple-700">Townhouse</SelectItem>
                  <SelectItem value="villa" className="hover:bg-teal-50 text-teal-700">Villa</SelectItem>
                  <SelectItem value="office" className="hover:bg-orange-50 text-orange-700">Office</SelectItem>
                  <SelectItem value="retail" className="hover:bg-red-50 text-red-700">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiDollarSign className="text-indigo-600" />
            Price & Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price" className="text-indigo-700 font-medium flex items-center gap-1">
                <IoIosPricetags className="text-indigo-600" />
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
                required
              />
            </div>
            <div>
              <Label htmlFor="area" className="text-indigo-700 font-medium flex items-center gap-1">
                <LuLandPlot className="text-indigo-600" />
                Area (sq ft)
              </Label>
              <Input
                id="area"
                type="number"
                value={formData.area}
                onChange={(e) => handleInputChange("area", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="currency" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaDollarSign className="text-indigo-600" />
                Currency
              </Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="USD" className="hover:bg-green-50 text-green-700">USD</SelectItem>
                  <SelectItem value="EUR" className="hover:bg-blue-50 text-blue-700">EUR</SelectItem>
                  <SelectItem value="GBP" className="hover:bg-purple-50 text-purple-700">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bedrooms" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaBed className="text-indigo-600" />
                Bedrooms
              </Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="bathrooms" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaShower className="text-indigo-600" />
                Bathrooms
              </Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="parkingSpaces" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaCar className="text-indigo-600" />
                Parking Spaces
              </Label>
              <Input
                id="parkingSpaces"
                type="number"
                value={formData.parkingSpaces}
                onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiMapPin className="text-indigo-600" />
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiMap className="text-indigo-600" />
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-indigo-700 font-medium flex items-center gap-1">
                <FaCity className="text-indigo-600" />
                City
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiFlag className="text-indigo-600" />
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiGlobe className="text-indigo-600" />
                Country
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiMapPin className="text-indigo-600" />
            Location Coordinates (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiCrosshair className="text-indigo-600" />
                Latitude
              </Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                value={formData.latitude || ""}
                onChange={(e) => handleInputChange("latitude", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
                placeholder="e.g., 37.7749"
              />
            </div>
            <div>
              <Label htmlFor="longitude" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiCrosshair className="text-indigo-600" />
                Longitude
              </Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                value={formData.longitude || ""}
                onChange={(e) => handleInputChange("longitude", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
                placeholder="e.g., -122.4194"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiUser className="text-indigo-600" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactName" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiUser className="text-indigo-600" />
                Contact Name
              </Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiMail className="text-indigo-600" />
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="contactNumber" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiPhone className="text-indigo-600" />
                Contact Number
              </Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="availableFrom" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiCalendar className="text-indigo-600" />
                Available From
              </Label>
              <Input
                id="availableFrom"
                type="date"
                value={formData.availableFrom}
                onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="rentPeriod" className="text-indigo-700 font-medium flex items-center gap-1">
                <FiClock className="text-indigo-600" />
                Rent Period
              </Label>
              <Input
                id="rentPeriod"
                value={formData.rentPeriod}
                onChange={(e) => handleInputChange("rentPeriod", e.target.value)}
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
                placeholder="e.g., Monthly, Yearly"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center gap-2">
            <FiCheckSquare className="text-indigo-600" />
            Amenities
          </h3>
          <div className="space-y-4">
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
              <SelectTrigger className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 w-full">
                <SelectValue placeholder="Select or search amenities..." />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-60 overflow-auto">
                {commonAmenities.map((amenity) => (
                  <SelectItem
                    key={amenity}
                    value={amenity}
                    className="hover:bg-indigo-50 text-indigo-700"
                  >
                    {amenity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-3">
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
                className="border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 placeholder-gray-400"
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
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300"
              >
                <FaPlus className="w-4 h-4 text-indigo-600" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="px-3 py-2 gap-2 bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-200"
                >
                  {amenity}
                  <span
                    className="cursor-pointer text-red-500 hover:text-red-700"
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

        <div className="flex justify-end gap-4 pt-6 bg-white/80 backdrop-blur-md rounded-xl p-5 border border-indigo-200 shadow-sm">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-2"
          >
            <FiX className="mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-6 py-2"
          >
            <FiPlus className="mr-2" /> Add Property
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
