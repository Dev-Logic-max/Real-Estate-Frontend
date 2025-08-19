"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Modals
import PropertyViewModal from "@/components/modals/PropertyViewModal"
import PropertyEditModal from "@/components/modals/PropertyEditModal"
import PropertyDeleteModal from "@/components/modals/PropertyDeleteModal"
import AddPropertyModal from "@/components/modals/NewPropertyModal"

// Types and APIs
import { propertyApi } from "@/lib/api/property"
import { AddProperty, Property } from "@/types"

// Icons and toast
import { toast } from "react-toastify"
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaHome, FaBuilding, FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from "react-icons/fa"
import { PiBathtub, PiBed, PiBuildingApartmentDuotone, PiBuildingDuotone, PiBuildingOfficeDuotone, PiBuildingsDuotone, PiEnvelope, PiEyeBold, PiHouseLineDuotone, PiMapPin, PiMapPinLine, PiPencilSimpleBold, PiPhoneCall, PiRuler, PiTrashBold, PiUserCircle } from "react-icons/pi"

export default function PropertiesPage() {
    const [layout, setLayout] = useState("grid")
    const [properties, setProperties] = useState<Property[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await propertyApi.search();
            setProperties(response.data.properties);
        } catch (error) {
            toast.error("Failed to fetch properties");
        } finally {
            setLoading(false);
        }
    };

    const filteredProperties = properties.filter((property: Property) => {
        const matchesSearch =
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.city || '').toLowerCase().includes(searchTerm.toLowerCase()) // Handle undefined city
        const matchesStatus = statusFilter === "all" || property.status === statusFilter
        const matchesType = typeFilter === "all" || property.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
    })

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
                return <PiBuildingOfficeDuotone className="w-6 h-6 text-cyan-500"/>
            case "house":
                return <PiHouseLineDuotone className="w-6 h-6 text-blue-500" />
            case "apartment":
                return <PiBuildingApartmentDuotone className="w-6 h-6 text-green-500" />
            case "penthouse":
                return <PiBuildingDuotone className="w-6 h-6 text-orange-500"/>
            case "cottage":
                return <PiBuildingsDuotone className="w-6 h-6 text-purple-500" />
            default:
                return <FaHome className="w-5 h-5 text-gray-500" />
        }
    }

    const formatPrice = (price: number, type: string) => {
        if (type === "rent") {
            return `$${price.toLocaleString()}/month`
        }
        return `$${price.toLocaleString()}`
    }

    const handleViewProperty = (property: Property) => {
        setSelectedProperty(property)
        setViewModalOpen(true)
    }

    const handleEditProperty = (property: Property) => {
        setSelectedProperty(property)
        setEditModalOpen(true)
    }

    const handleDeleteProperty = (property: Property) => {
        setSelectedProperty(property)
        setDeleteModalOpen(true)
    }

    const handleSaveProperty = async (propertyData: Partial<Property>) => {
        if (!selectedProperty) return
        try {
            const response = await propertyApi.update(selectedProperty._id, propertyData);
            setProperties(properties.map(p => p._id === selectedProperty._id ? { ...p, ...response.data.property } : p));
            toast.success("Property updated successfully");
            setEditModalOpen(false);
            fetchProperties(); // Refresh list
        } catch (error) {
            toast.error("Failed to update property");
        }
    }

    const handleConfirmDelete = async (propertyId: string) => {
        try {
            await propertyApi.delete(propertyId);
            setProperties(properties.filter(p => p._id !== propertyId));
            toast.success("Property deleted successfully");
            setDeleteModalOpen(false);
            fetchProperties(); // Refresh list
        } catch (error) {
            toast.error("Failed to delete property");
        }
    }

    const handleAddProperty = async (propertyData: AddProperty) => {
        try {
            const response = await propertyApi.create(propertyData);
            console.log("Response of create property api:", response); // Debug log
            const newProperty = 'property' in response.data ? response.data.property : response.data;
            setProperties([...properties, newProperty]);
            toast.success("Property added successfully");
            fetchProperties(); // Refresh list
        } catch (error) {
            toast.error("Failed to add property");
        } finally {
            setAddModalOpen(false); // Ensure modal closes regardless of success/failure
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold gradient-text-primary">Property Management</h2>
                    <p className="text-gray-600">Manage all property listings and their details</p>
                </div>
                <Button
                    className="gradient-primary text-white hover:opacity-90 shadow-gradient-blue"
                    onClick={() => setAddModalOpen(true)}
                >
                    <FaPlus className="mr-2" />
                    Add New Property
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex-1">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 border-blue-200 focus:border-blue-400"
                        />
                    </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40 border-blue-200">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-40 border-blue-200">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card className="shadow-lg pt-0 overflow-hidden">
                <CardHeader className="gap-0 pt-4 pb-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                    <CardTitle className="flex items-center justify-between text-gray-600">
                        <span className="gradient-text text-xl font-semibold">All Properties ({properties.length})</span>
                        <Select value={layout} onValueChange={setLayout}>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 text-sm">
                                <SelectValue placeholder="Layout" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="grid">Grid</SelectItem>
                                <SelectItem value="horizontal">Horizontal</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            <FaHome className="mx-auto text-6xl text-gray-300 mb-4" />
                            <p className="text-lg">Loading properties...</p>
                        </div>
                    ) : layout === "grid" ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProperties.map((property: any) => (
                                <Card
                                    key={property._id}
                                    className="py-0 gap-0 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-blue-100"
                                >
                                    <div className="relative">
                                        <AutoImageSlider
                                            images={
                                                property.images?.map((img: string) => ({
                                                    src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                                                    alt: property.title,
                                                }))
                                            }
                                            height={220}
                                            className="w-full"
                                            interval={5000}
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                                        </div>

                                        {/* Type Badge */}
                                        <div className="absolute top-3 right-3">
                                            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm capitalize">
                                                {property.type}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-4 space-y-4 justify-between flex flex-col h-full">
                                        <div className="space-y-4">
                                            {/* Property Title and Price */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-2xl text-gray-900">{property.title}</h3>
                                                    {getTypeIcon(property.propertyType)}
                                                </div>
                                                <div className="text-2xl font-bold text-green-600">
                                                    {formatPrice(property.price, property.type)}
                                                </div>
                                            </div>

                                            {/* Property Details */}
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                {property.bedrooms && (
                                                    <div className="flex items-center space-x-1">
                                                        <FaBed className="text-blue-500" />
                                                        <span>{property.bedrooms}</span>
                                                    </div>
                                                )}
                                                {property.bathrooms && (
                                                    <div className="flex items-center space-x-1">
                                                        <FaBath className="text-green-500" />
                                                        <span>{property.bathrooms}</span>
                                                    </div>
                                                )}
                                                {property.area && (
                                                    <div className="flex items-center space-x-1">
                                                        <FaRulerCombined className="text-purple-500" />
                                                        <span>{property.area} sq ft</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Address & Location */}
                                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                <FaMapMarkerAlt className="text-red-500" />
                                                <span className="line-clamp-1">
                                                    {property.address}, {property.city}, {property.state}
                                                </span>
                                            </div>

                                            {/* Agent Info */}
                                            {property.agents.length > 0 && (
                                                <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <FaUser className="text-blue-500" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{property.agents[0].name}</p>
                                                            <p className="text-xs text-gray-500">{property.agents[0].commissionRate}% commission</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Contact Info */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <FaUser className="text-gray-400" />
                                                    <span>{property.contactName}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <FaEnvelope className="text-gray-400" />
                                                    <span className="line-clamp-1">{property.contactEmail}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <FaPhone className="text-gray-400" />
                                                    <span>{property.contactNumber}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200"
                                                    onClick={() => handleViewProperty(property)}
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-green-500 hover:text-green-600 hover:bg-green-100 transition-all duration-200"
                                                    onClick={() => handleEditProperty(property)}
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-100 transition-all duration-200"
                                                    onClick={() => handleDeleteProperty(property)}
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Property ID */}
                                            <span className="text-xs text-gray-400">ID: {property._id}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredProperties.map((property: any) => (
                                <Card
                                    key={property._id}
                                    className="flex flex-col sm:flex-row py-0 overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100"
                                >
                                    <div className="block">
                                        <AutoImageSlider
                                            images={
                                                property.images?.map((img: string) => ({
                                                    src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                                                    alt: property.title,
                                                })) || []
                                            }
                                            width={440}
                                            className="h-full"
                                            interval={5000}
                                        />
                                    </div>
                                    <CardContent className="w-full sm:w-2/3 p-4 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="font-semibold text-2xl text-gray-900">{property.title}</h3>
                                                {getTypeIcon(property.propertyType)}
                                            </div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatPrice(property.price, property.type)}
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2">
                                            <Badge
                                                className={`px-2 py-1 rounded-full text-sm font-medium shadow-md ${property.status === "active"
                                                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                                                    : property.status === "pending"
                                                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                                                        : property.status === "inactive"
                                                            ? "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
                                                            : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                                                    }`}
                                            >
                                                {property.status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className={`px-2 py-1 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm border ${property.type === "sale"
                                                    ? "text-green-600 border-green-200 hover:bg-green-50"
                                                    : "text-blue-600 border-blue-200 hover:bg-blue-50"
                                                    }`}
                                            >
                                                {property.type}
                                            </Badge>
                                            {property.purpose && (
                                                <Badge
                                                    className={`px-2 py-1 rounded-full text-sm font-medium shadow-md ${property.purpose === "residential"
                                                        ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                                                        : "bg-gradient-to-r from-orange-400 to-amber-500 text-white"
                                                        }`}
                                                >
                                                    {property.purpose}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex gap-8">
                                            <div className="space-y-2">
                                                {/* Property Details */}
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    {property.bedrooms && (
                                                        <div className="flex items-center space-x-1">
                                                            <PiBed className="text-blue-500" />
                                                            <span>{property.bedrooms}</span>
                                                        </div>
                                                    )}
                                                    {property.bathrooms && (
                                                        <div className="flex items-center space-x-1">
                                                            <PiBathtub className="text-green-500" />
                                                            <span>{property.bathrooms}</span>
                                                        </div>
                                                    )}
                                                    {property.area && (
                                                        <div className="flex items-center space-x-1">
                                                            <PiRuler className="text-purple-500" />
                                                            <span>{property.area} sq ft</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Location and Address */}
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <PiMapPin className="text-red-500" />
                                                    <span className="">
                                                        {property.city}, {property.state}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                    <PiMapPinLine className="text-gray-400" />
                                                    <span className="line-clamp-1">{property.address}</span>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <PiUserCircle className="text-gray-400" />
                                                    <span>{property.contactName}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <PiEnvelope className="text-gray-400" />
                                                    <span className="line-clamp-1">{property.contactEmail}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-gray-600">
                                                    <PiPhoneCall className="text-gray-400" />
                                                    <span>{property.contactNumber}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                            <span className="text-xs text-gray-400">ID: {property._id}</span>
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-blue-500 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 rounded-md transition-all duration-200"
                                                    onClick={() => handleViewProperty(property)}
                                                >
                                                    <PiEyeBold className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-green-500 bg-green-50 hover:bg-green-100 hover:text-green-700 rounded-md transition-all duration-200"
                                                    onClick={() => handleEditProperty(property)}
                                                >
                                                    <PiPencilSimpleBold className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-md transition-all duration-200"
                                                    onClick={() => handleDeleteProperty(property)}
                                                >
                                                    <PiTrashBold className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {filteredProperties.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">
                    <FaHome className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-lg">No properties found matching your criteria</p>
                </div>
            )}

            <PropertyViewModal property={selectedProperty} isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} />

            <PropertyEditModal
                property={selectedProperty}
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                onSave={handleSaveProperty}
            />

            <PropertyDeleteModal
                property={selectedProperty}
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />

            <AddPropertyModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddProperty} />
        </div>
    )
}