"use client"

import { useState, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { FiEye, FiMessageCircle, FiEdit3, FiTrash2, FiPlus, FiSearch, FiFilter } from "react-icons/fi"

import PropertyViewModal from "@/components/modals/PropertyViewModal"
import PropertyEditModal from "@/components/modals/PropertyEditModal"
import PropertyDeleteModal from "@/components/modals/PropertyDeleteModal"
import AddPropertyModal from "@/components/modals/NewPropertyModal"
import AutoImageSlider from "@/components/common/AutoImageSlider"

import { propertyApi } from "@/lib/api/property"
import { AddProperty, Property } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"

export default function UserPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)
    const { user } = useAuth() // Get current user ID from auth context

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)

    useEffect(() => {
        if (user?.id) {
            fetchUserProperties(user.id)
        }
    }, [user?.id])

    const fetchUserProperties = async (userId: string) => {
        setLoading(true)
        try {
            const response = await propertyApi.getByOwnerId(userId)
            setProperties(response.data.properties || [])
        } catch (error) {
            toast.error("Failed to fetch properties")
        } finally {
            setLoading(false)
        }
    }

    const filteredProperties = properties.filter(
        (property) =>
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.city || '').toLowerCase().includes(searchTerm.toLowerCase()),
    )

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

    const handleSaveProperty = async (updatedPropertyData: Partial<Property>) => {
        if (!selectedProperty) return
        try {
            const response = await propertyApi.update(selectedProperty._id, updatedPropertyData)
            setProperties(properties.map(p => p._id === selectedProperty._id ? { ...p, ...response.data.property } : p))
            toast.success("Property updated successfully")
            fetchUserProperties(user!.id)
        } catch (error) {
            toast.error("Failed to update property")
        } finally {
            setEditModalOpen(false)
        }
    }

    const handleConfirmDelete = async (propertyId: string) => {
        try {
            await propertyApi.delete(propertyId)
            setProperties(properties.filter(p => p._id !== propertyId))
            toast.success("Property deleted successfully")
            fetchUserProperties(user!.id)
        } catch (error) {
            toast.error("Failed to delete property")
        } finally {
            setDeleteModalOpen(false)
        }
    }

    const handleAddProperty = async (newPropertyData: AddProperty) => {
        try {
            const response = await propertyApi.create(newPropertyData)
            const newProperty = 'property' in response.data ? response.data.property : response.data;
            setProperties([...properties, newProperty])
            toast.success("Property added successfully")
            fetchUserProperties(user!.id)
        } catch (error) {
            toast.error("Failed to add property")
        } finally {
            setAddModalOpen(false)
        }
    }
    
    const onAddProperty = () => {
        fetchUserProperties(user!.id)
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">My Properties</h1>
                    <p className="text-gray-600">Manage and track your property listings</p>
                </div>
                <Button className="gradient-primary text-white px-6 py-3 shadow-lg hover-lift" onClick={() => setAddModalOpen(true)}>
                    <FiPlus className="mr-2" />
                    Add New Property
                </Button>
            </div>

            {/* Search and Filters */}
            <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search properties..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-blue-500"
                            />
                        </div>
                        <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent">
                            <FiFilter className="mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {loading ? (
                    <div className="text-center py-12 text-gray-500 col-span-full">
                        <p>Loading properties...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 col-span-full">
                        <p>No properties found</p>
                    </div>
                ) : (
                    filteredProperties.map((property) => (
                        <Card key={property._id} className="shadow-lg border-0 hover-lift py-0">
                            <div className="relative rounded-xl overflow-hidden m-4">
                                <AutoImageSlider
                                    images={
                                        property.images?.map((img) => ({
                                            src: `${process.env.NEXT_PUBLIC_PICTURES_URL}${img}`,
                                            alt: property.title || "Property Image",
                                        })) || [{ src: "/placeholder.svg", alt: "Placeholder" }]
                                    }
                                    height={256} // Adjust height as needed (e.g., 256px for h-64)
                                    className="w-full rounded-t-lg"
                                />
                                <Badge
                                    className={`absolute top-4 left-4 ${property.status === "active" ? "bg-green-500 hover:bg-green-600" : "bg-yellow-500 hover:bg-yellow-600"
                                        } text-white`}
                                >
                                    {property.status}
                                </Badge>
                            </div>

                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">{property.title}</h3>
                                    <span className="text-2xl font-bold gradient-text-primary">${property.price.toLocaleString()}</span>
                                </div>

                                <p className="text-gray-600 mb-4">{property.address || `${property.city}, ${property.state}`}</p>

                                <div className="flex items-center space-x-6 mb-6 text-sm text-gray-500">
                                    <span>{property.bedrooms} beds</span>
                                    <span>{property.bathrooms} baths</span>
                                </div>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4 text-sm">
                                        <div className="flex items-center space-x-1 text-blue-600">
                                            <FiEye />
                                            <span>{ }0 views</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-green-600">
                                            <FiMessageCircle />
                                            <span>{ }0 inquiries</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Button className="flex-1 gradient-primary text-white" onClick={() => handleViewProperty(property)}>
                                        <FiEye className="mr-2" />
                                        View Details
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                                        onClick={() => handleEditProperty(property)}
                                    >
                                        <FiEdit3 />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                                        onClick={() => handleDeleteProperty(property)}
                                    >
                                        <FiTrash2 />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

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

            <AddPropertyModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} onAddProperty={onAddProperty}/>
        </div>
    )
}