"use client"

import React from "react"
import { useRef, useState } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { FiX, FiHome, FiMapPin, FiDollarSign, FiUser, FiTag, FiAlignLeft, FiList, FiSquare, FiDroplet, FiMap, FiFlag, FiGlobe, FiCrosshair, FiMail, FiPhone, FiCalendar, FiClock, FiCheckSquare, FiPlus, FiImage, FiUpload, FiCamera, FiEdit3, FiType, FiSettings, FiCheck, FiNavigation, FiThermometer, FiWind, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { FaBed, FaBuilding, FaCamera, FaCar, FaCheckCircle, FaCity, FaDollarSign, FaEye, FaHome, FaMapMarkerAlt, FaPlus, FaShower, FaTrash, FaUser } from "react-icons/fa"
import { PiBuildingDuotone, PiCityDuotone, PiFlagDuotone, PiHouseLineDuotone, PiMapPinLineDuotone, PiUploadSimple } from "react-icons/pi"
import { IoBedOutline, IoCarSportSharp } from "react-icons/io5";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { IoIosBed, IoIosPricetags } from "react-icons/io";
import { GoChecklist } from "react-icons/go";
import { LuLandPlot } from "react-icons/lu";
import { FaLandmark } from "react-icons/fa6";
import { FcGlobe } from "react-icons/fc";

import { toast } from "react-toastify"
import { propertyApi } from "@/lib/api/property"
import { AddProperty } from "@/types"

import AutoImageSlider from "../common/AutoImageSlider"
import MapboxMap from "../map/MapboxMap";

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd?: (propertyData: AddProperty) => void
  onAddProperty?: () => void
}

export default function AddPropertyModal({ isOpen, onClose, onAddProperty }: AddPropertyModalProps) {

  const totalSteps = 6
  const [currentStep, setCurrentStep] = useState(1)
  const [newAmenity, setNewAmenity] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isPropertyCreated, setIsPropertyCreated] = useState(false)
  const [propertyId, setPropertyId] = useState<string | null>(null)
  const [addressValid, setAddressValid] = useState(false)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

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
    "Pet Friendly",
    "Internet",
  ]

  const steps = [
    { id: 1, title: "Basic Info", icon: FiHome, color: "text-blue-600 from-blue-500 to-indigo-500", tooltip: "Property details and specifications" },
    { id: 2, title: "Location", icon: FiMapPin, color: "text-red-600 from-green-500 to-emerald-500", tooltip: "Address and geographical information" },
    { id: 3, title: "Pricing", icon: FiDollarSign, color: "text-green-600 from-purple-500 to-pink-500", tooltip: "Price and financial details" },
    { id: 4, title: "Contact", icon: FiUser, color: "text-purple-600 from-orange-500 to-red-500", tooltip: "Contact information and availability" },
    { id: 5, title: "Media", icon: FiCamera, color: "text-orange-600 from-teal-500 to-cyan-500", tooltip: "Photos and videos upload" },
    { id: 6, title: "Review", icon: FaEye, color: "text-teal-600 from-rose-500 to-pink-500", tooltip: "Review all information before submitting" },
  ]

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !propertyId) {
      toast.error("No file selected or property ID missing");
      return;
    }

    const formDataToUpload = new FormData()
    Array.from(files).forEach((file) => formDataToUpload.append("files", file))

    try {
      const response = await propertyApi.uploadImage(propertyId, formDataToUpload)
      const newImages = response.data.image || []
      setUploadedImages((prev) => [
        ...prev,
        ...Array.from(files).map((file) => URL.createObjectURL(file))
      ])
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
    setUploadedImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      if (field === "availableFrom") {
        return { ...prev, [field]: value }
      } else if (field === "isFurnished") {
        return { ...prev, [field]: Boolean(value) }
        // } else if (field === "address" || field === "city" || field === "state" || field === "country") {
      } else if (field === "address") {
        // setCoordinates(null); // Reset coordinates and map when address changes
        setAddressValid(false);
        return { ...prev, [field]: value };
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

  const handleFetchCoordinates = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.country) {
      toast.error("Please enter a complete address (street, city, state, country).");
      // return;
    }

    console.log("Before fetch - Form Data:", { ...formData });

    try {
      const query = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=1`
      );
      const data = await response.json();
      console.log("Fetched Data from Mapbox:", data); // Log raw API response

      if (data.features && data.features.length > 0) {

        // const [lng, lat] = data.features[0].center;
        const [lng, lat] = data.features[0].geometry.coordinates;

        // Update formData with fetched coords
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
        setAddressValid(true);

        // Also update map center (red marker)
        setCoordinates({ lat, lng });

        console.log("After fetch - Updated Coordinates:", { lat, lng });
        toast.success("Coordinates fetched successfully!");
      } else {
        toast.error("No coordinates found for the address.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      toast.error("Failed to fetch coordinates. Please check your address or try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (currentStep === 4) {
      const propertyData: AddProperty = {
        ...formData,
        price: Number.parseFloat(formData.price) || 0,
        area: Number.parseFloat(formData.area) || 0,
        bedrooms: Number.parseInt(formData.bedrooms) || 0,
        bathrooms: Number.parseInt(formData.bathrooms) || 0,
        parkingSpaces: Number.parseInt(formData.parkingSpaces) || 0,
        floorNumber: Number.parseInt(formData.floorNumber) || 0,
        availableFrom: formData.availableFrom,
        type: formData.type as 'sale' | 'rent',
        ownerId: localStorage.getItem("userId") || "current-user-id",
        agents: [],
        ...(formData.latitude && formData.longitude
          ? {
            location: {
              type: "Point",
              coordinates: [Number(formData.longitude), Number(formData.latitude)],
            },
          }
          : {}),
        status: formData.status as 'pending' | 'approved' | 'rejected' | 'active' | 'inactive',
      }

      if (!propertyData.title || !propertyData.price || !propertyData.address) {
        toast.error("Title, price, and address are required.")
        return
      }

      try {
        const response = await propertyApi.create(propertyData)
        const newProperty = 'property' in response.data ? response.data.property : response.data;
        setPropertyId(newProperty?._id)
        setIsPropertyCreated(true)
        toast.success("Property created successfully!")
        toast.info("Now upload media 🖼️.")
        onAddProperty?.()
        nextStep()
      } catch (error) {
        toast.error("Failed to add property. Please try again.")
      }
    } else if (currentStep === 5) {
      if (formData.images && formData.images.length > 0 && propertyId) {
        try {
          const updateData = { images: formData.images }; // Send image URLs as JSON
          await propertyApi.update(propertyId, updateData)
          toast.success("Media uploaded and property saved!")
          // onAdd?.({ ...formData, _id: propertyId }); // Notify parent of updated property
        } catch (error) {
          toast.error("Failed to upload media")
        }
      } else {
        toast.warning("No images to upload or property not created.");
      }

      setFormData({
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
      setCurrentStep(1)
      setIsPropertyCreated(false)
      setPropertyId(null)
      onClose()
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiEdit3 className="h-4 w-4 text-blue-500" />
                  Property Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter property title"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiType className="h-4 w-4 text-purple-500" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 min-h-[120px] bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                  placeholder="Describe your property..."
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiList className="h-4 w-4 text-green-500" />
                  Listing Type *
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
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
                <Label htmlFor="propertyType" className="text-slate-700 font-medium flex items-center gap-2">
                  <HiOutlineBuildingLibrary className="h-4 w-4 text-orange-500" />
                  Property Type *
                </Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 bg-gradient-to-r from-orange-50/30 to-amber-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bedrooms" className="text-slate-700 font-medium flex items-center gap-2">
                  <IoIosBed className="h-4 w-4 text-indigo-500" />
                  Bedrooms
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                  className="border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 bg-gradient-to-r from-indigo-50/30 to-blue-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-slate-700 font-medium flex items-center gap-2">
                  <FaShower className="h-4 w-4 text-cyan-500" />
                  Bathrooms
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                  className="border-slate-200 focus:border-cyan-400 focus:ring-cyan-400 bg-gradient-to-r from-cyan-50/30 to-teal-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-slate-700 font-medium flex items-center gap-2">
                  <LuLandPlot className="h-4 w-4 text-rose-500" />
                  Area (sq ft)
                </Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  className="border-slate-200 focus:border-rose-400 focus:ring-rose-400 bg-gradient-to-r from-rose-50/30 to-pink-50/30"
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="parkingSpaces" className="text-slate-700 font-medium flex items-center gap-2">
                  <IoCarSportSharp className="h-4 w-4 text-violet-500" />
                  Parking Spaces
                </Label>
                <Input
                  id="parkingSpaces"
                  type="number"
                  value={formData.parkingSpaces}
                  onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                  className="border-slate-200 focus:border-violet-400 focus:ring-violet-400 bg-gradient-to-r from-violet-50/30 to-purple-50/30"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <GoChecklist className="h-5 w-5 text-blue-600" />
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
                  <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 w-full">
                    <SelectValue placeholder="Select or search amenities..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-60 overflow-auto">
                    {commonAmenities.map((amenity) => (
                      <SelectItem
                        key={amenity}
                        value={amenity}
                        className="hover:bg-blue-50 text-blue-700"
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
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 placeholder-gray-400"
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
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <FaPlus className="w-4 h-4 text-blue-600" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-2 gap-2 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-400 transition-all duration-200"
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

            <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <Switch
                id="furnished"
                checked={formData.isFurnished}
                onCheckedChange={(checked) => handleInputChange("isFurnished", checked)}
              />
              <Label htmlFor="furnished" className="text-emerald-700 font-medium flex items-center gap-2">
                <PiHouseLineDuotone className="h-5 w-5" />
                Property is furnished
              </Label>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-slate-700 font-medium flex items-center gap-2">
                  <PiMapPinLineDuotone className="h-4 w-4 text-red-500" />
                  Street Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  onBlur={() => {
                    setAddressValid(true);
                  }}
                  className="border-slate-200 focus:border-red-400 focus:ring-red-400 bg-gradient-to-r from-red-50/30 to-rose-50/30"
                  placeholder="Enter street address"
                  autoComplete="off" // Disable browser autocomplete
                  required
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-slate-700 font-medium flex items-center gap-2">
                  <PiCityDuotone className="h-4 w-4 text-blue-500" />
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-slate-700 font-medium flex items-center gap-2">
                  <PiFlagDuotone className="h-4 w-4 text-green-500" />
                  State/Province *
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter state/Province"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-slate-700 font-medium flex items-center gap-2">
                  <FcGlobe className="h-4 w-4 text-purple-500" />
                  Country *
                </Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                  placeholder="Enter country"
                />
              </div>
              <div>
                <Label htmlFor="floorNumber" className="text-slate-700 font-medium flex items-center gap-2">
                  <PiBuildingDuotone className="h-4 w-4 text-orange-500" />
                  Floor Number
                </Label>
                <Input
                  id="floorNumber"
                  type="number"
                  value={formData.floorNumber}
                  onChange={(e) => handleInputChange("floorNumber", e.target.value)}
                  className="border-slate-200 focus:border-orange-400 focus:ring-orange-400 bg-gradient-to-r from-orange-50/30 to-amber-50/30"
                  placeholder="Floor number"
                />
              </div>
              <div className="md:col-span-2">
                <Button
                  type="button"
                  onClick={handleFetchCoordinates}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  disabled={!addressValid}
                >
                  <FiNavigation className="mr-2 h-4 w-4" />
                  Fetch Coordinates
                </Button>
              </div>
              {coordinates && (
                <div className="md:col-span-2 rounded-xl overflow-hidden border border-gray-300">
                  <MapboxMap
                    latitude={coordinates.lat}
                    longitude={coordinates.lng}
                    onCoordsChange={(lat, lng) => {
                      // setCoordinates({ lat, lng });
                      setFormData((prev: any) => ({
                        ...prev,
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                      }));
                      toast.info("🗺️ Coordinates updated");
                      toast.success("📍Custom location selected!");
                    }}
                  />
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
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
                    value={formData.latitude}
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
                    value={formData.longitude}
                    onChange={(e) => handleInputChange("longitude", e.target.value)}
                    className="border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50"
                    placeholder="e.g., -74.0060"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4 text-green-500" />
                  Price *
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <Label htmlFor="currency" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiGlobe className="h-4 w-4 text-blue-500" />
                  Currency
                </Label>
                <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === "rent" && (
                <div>
                  <Label htmlFor="rentPeriod" className="text-slate-700 font-medium flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-purple-500" />
                    Rent Period
                  </Label>
                  <Select value={formData.rentPeriod} onValueChange={(value) => handleInputChange("rentPeriod", value)}>
                    <SelectTrigger className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-gradient-to-r from-purple-50/30 to-pink-50/30">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
              <h4 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                <FiSettings className="h-5 w-5" />
                Additional Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availableFrom" className="text-green-700 font-medium flex items-center gap-2">
                    <FiCalendar className="h-4 w-4" />
                    Available From
                  </Label>
                  <Input
                    id="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={(e) => handleInputChange("availableFrom", e.target.value)}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="purpose" className="text-green-700 font-medium flex items-center gap-2">
                    <FiHome className="h-4 w-4" />
                    Purpose
                  </Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleInputChange("purpose", value)}>
                    <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/50">
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
                <div>
                  <Label htmlFor="heatingSystem" className="text-green-700 font-medium flex items-center gap-2">
                    <FiThermometer className="h-4 w-4" />
                    Heating System
                  </Label>
                  <Input
                    id="heatingSystem"
                    value={formData.heatingSystem}
                    onChange={(e) => handleInputChange("heatingSystem", e.target.value)}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/50"
                    placeholder="e.g., Central heating"
                  />
                </div>
                <div>
                  <Label htmlFor="coolingSystem" className="text-green-700 font-medium flex items-center gap-2">
                    <FiWind className="h-4 w-4" />
                    Cooling System
                  </Label>
                  <Input
                    id="coolingSystem"
                    value={formData.coolingSystem}
                    onChange={(e) => handleInputChange("coolingSystem", e.target.value)}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400 bg-white/50"
                    placeholder="e.g., Central AC"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactName" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-blue-500" />
                  Contact Name *
                </Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange("contactName", e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400 bg-gradient-to-r from-blue-50/30 to-indigo-50/30"
                  placeholder="Enter contact name"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiMail className="h-4 w-4 text-green-500" />
                  Contact Email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  className="border-slate-200 focus:border-green-400 focus:ring-green-400 bg-gradient-to-r from-green-50/30 to-emerald-50/30"
                  placeholder="Enter email address"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="contactNumber" className="text-slate-700 font-medium flex items-center gap-2">
                  <FiPhone className="h-4 w-4 text-purple-500" />
                  Contact Number *
                </Label>
                <Input
                  id="contactNumber"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                  className="border-slate-200 focus:border-purple-400 focus:ring-purple-400 bg-gradient-to-r from-purple-50/30 to-pink-50/30"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <FiCheck className="h-5 w-5" />
                Review Your Listing
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiEdit3 className="h-3 w-3" />
                    <strong>Title:</strong> {formData.title || "Not specified"}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiHome className="h-3 w-3" />
                    <strong>Type:</strong> {formData.type === "sale" ? "For Sale" : "For Rent"}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiSettings className="h-3 w-3" />
                    <strong>Property Type:</strong> {formData.propertyType}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiDollarSign className="h-3 w-3" />
                    <strong>Price:</strong> {formData.currency} {formData.price || "0"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiMapPin className="h-3 w-3" />
                    <strong>Location:</strong> {formData.city || "Not specified"}, {formData.state || "Not specified"}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FaBed className="h-3 w-3" />
                    <strong>Bedrooms:</strong> {formData.bedrooms || "0"}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiSettings className="h-3 w-3" />
                    <strong>Bathrooms:</strong> {formData.bathrooms || "0"}
                  </p>
                  <p className="text-blue-700 flex items-center gap-2">
                    <FiSquare className="h-3 w-3" />
                    <strong>Area:</strong> {formData.area || "0"} sq ft
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {(!isPropertyCreated || !propertyId) &&
              <div className="text-center py-4 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800">
                <p className="font-medium">Note: Please fill all data and create the property first to upload pictures.</p>
              </div>
            }
            <div className="text-center py-8">
              <FiCamera className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Upload Property Media</h3>
              <p className="text-slate-500 mb-6">Add photos and videos to showcase your property</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-blue-400 transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-indigo-50/50">
                  <FiCamera className="mx-auto h-12 w-12 text-blue-500 mb-3" />
                  <h4 className="font-semibold text-slate-700 mb-2">Property Photos</h4>
                  <p className="text-sm text-slate-500 mb-4">Upload high-quality images of your property</p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isPropertyCreated}
                    className={`border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent ${!isPropertyCreated ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Upload Images
                  </Button>
                  <p className="text-xs text-slate-400 mt-2">JPG, PNG up to 10MB each</p>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 hover:border-purple-400 transition-all duration-200 hover:bg-gradient-to-br hover:from-purple-50/50 hover:to-pink-50/50">
                  <FiSettings className="mx-auto h-12 w-12 text-purple-500 mb-3" />
                  <h4 className="font-semibold text-slate-700 mb-2">Property Videos</h4>
                  <p className="text-sm text-slate-500 mb-4">Add video tours or walkthroughs</p>
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 bg-transparent"
                  >
                    Choose Videos
                  </Button>
                  <p className="text-xs text-slate-400 mt-2">MP4, MOV up to 100MB each</p>
                </div>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-slate-700 mb-2">Uploaded Images</h4>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Uploaded Image ${index + 1}`}
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
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
              <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                <FiCamera className="h-5 w-5" />
                Photography Tips
              </h4>
              <ul className="text-sm text-amber-700 space-y-2">
                <li className="flex items-center gap-2">
                  <FiCheck className="h-3 w-3 text-amber-600" />
                  Take photos during daylight hours for best lighting
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="h-3 w-3 text-amber-600" />
                  Include photos of all rooms, exterior, and key features
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="h-3 w-3 text-amber-600" />
                  Ensure rooms are clean and well-staged
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="h-3 w-3 text-amber-600" />
                  Use landscape orientation for better viewing
                </li>
              </ul>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
              <h4 className="text-xl font-semibold text-teal-800 mb-6 flex items-center gap-2">
                <FaEye className="h-5 w-5" />
                Review Your Property Listing
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                      <FaHome className="h-4 w-4" />
                      Basic Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Title:</strong> {formData.title || "Not specified"}
                      </p>
                      <p>
                        <strong>Type:</strong> {formData.type === "sale" ? "For Sale" : "For Rent"}
                      </p>
                      <p>
                        <strong>Property Type:</strong> {formData.propertyType}
                      </p>
                      <p>
                        <strong>Bedrooms:</strong> {formData.bedrooms || "0"}
                      </p>
                      <p>
                        <strong>Bathrooms:</strong> {formData.bathrooms || "0"}
                      </p>
                      <p>
                        <strong>Area:</strong> {formData.area || "0"} sq ft
                      </p>
                      <p>
                        <strong>Parking:</strong> {formData.parkingSpaces || "0"} spaces
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                      <FaMapMarkerAlt className="h-4 w-4" />
                      Location
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Address:</strong> {formData.address || "Not specified"}
                      </p>
                      <p>
                        <strong>City:</strong> {formData.city || "Not specified"}
                      </p>
                      <p>
                        <strong>State:</strong> {formData.state || "Not specified"}
                      </p>
                      <p>
                        <strong>Country:</strong> {formData.country || "Not specified"}
                      </p>
                      {formData.floorNumber && (
                        <p>
                          <strong>Floor:</strong> {formData.floorNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                      <FaDollarSign className="h-4 w-4" />
                      Pricing
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Price:</strong> {formData.currency} {formData.price || "0"}
                      </p>
                      {formData.type === "rent" && formData.rentPeriod && (
                        <p>
                          <strong>Period:</strong> {formData.rentPeriod}
                        </p>
                      )}
                      <p>
                        <strong>Purpose:</strong> {formData.purpose}
                      </p>
                      <p>
                        <strong>Available From:</strong> {formData.availableFrom || "Immediately"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-lg">
                    <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                      <FaUser className="h-4 w-4" />
                      Contact Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Name:</strong> {formData.contactName || "Not specified"}
                      </p>
                      <p>
                        <strong>Email:</strong> {formData.contactEmail || "Not specified"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {formData.contactNumber || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {formData.amenities.length > 0 && (
                <div className="bg-white/60 p-4 rounded-lg mt-4">
                  <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                    <FaCheckCircle className="h-4 w-4" />
                    Amenities
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-semibold text-teal-700 mb-3 flex items-center gap-2">
                    <FaCamera className="h-4 w-4" />
                    Uploaded Images
                  </h5>
                  <div className="flex flex-wrap gap-3">
                    {uploadedImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Uploaded Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[95vh] bg-white border-2 border-slate-200 shadow-2xl overflow-y-auto">
        <DialogHeader className="relative pb-6">
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent flex items-center gap-3">
            <FaLandmark className="text-green-500" />
            Add New Property
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0 text-slate-500 hover:text-slate-700 hover:bg-red-100"
          >
            <FiX className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <div className="mb-8">
          <TooltipProvider>
            <div className="flex items-center justify-between relative px-4">
              <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 -translate-y-1/2 z-0 rounded-full" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 -translate-y-1/2 z-10 transition-all duration-700 ease-out rounded-full"
                style={{
                  width: `${Math.max(0, ((currentStep - 1) / (totalSteps - 1)) * 100)}%`,
                  right: `${100 - ((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <Tooltip key={step.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => goToStep(step.id)}
                        className={`relative z-20 flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform hover:scale-105 group w-20 ${isActive
                            ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-105 ring-2 ring-white ring-opacity-50`
                            : isCompleted
                              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md hover:shadow-lg"
                              : "bg-white text-slate-500 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 border-2 border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                          }`}
                      >
                        <div
                          className={`p-2.5 rounded-full mb-1.5 transition-all duration-300 ${isActive
                              ? "bg-white/20" // Removed background to let gradient shine through
                              : isCompleted
                                ? "bg-white/20"
                                : "bg-gradient-to-r from-slate-100 to-blue-100 group-hover:from-blue-100 group-hover:to-indigo-100"
                            }`}
                        >
                          {isCompleted ? <FiCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <span className="text-xs font-semibold tracking-wide">{step.title}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-700 shadow-xl"
                    >
                      <p className="font-medium">{step.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-1 mb-6">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
              {renderStepContent()}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 bg-transparent"
            >
              <FiChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              >
                Next
                <FiChevronRight className="h-4 w-4" />
              </Button>
            ) : currentStep === 4 ? (
              <Button
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                {isPropertyCreated ? "Update" : "Create Property"}
                <FiCheck className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                Save
                <FiCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
