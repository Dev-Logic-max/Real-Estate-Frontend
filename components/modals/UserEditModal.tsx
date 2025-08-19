"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaMinus, FaPlus, FaSave, FaTimes } from "react-icons/fa"
import { LiaUserEditSolid } from "react-icons/lia";
import { RoleEnum, StatusEnum, User } from "@/types"
import { roleMap } from "@/utils"
import { userApi } from "@/lib/api/user"
import { toast } from "react-toastify"
import { FiX } from "react-icons/fi"

interface UserEditModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
    onSave: (userData: Partial<User>) => void
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
    const [profilePhotos, setProfilePhotos] = useState<File[]>([])
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        // role: user?.roles || [RoleEnum.User],
        roles: user?.roles.length ? [...user.roles] : [RoleEnum.User], // Ensure at least User role
        status: user?.status || StatusEnum.Active,
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            zipCode: user?.address?.zipCode || "",
        },
        profilePhotos: user?.profilePhotos || [],
    })

    // Sync formData with user prop when it changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                roles: user.roles.length ? [...user.roles] : [RoleEnum.User],
                status: user.status || StatusEnum.Active,
                address: {
                    street: user.address?.street || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    country: user.address?.country || "",
                    zipCode: user.address?.zipCode || "",
                },
                profilePhotos: user?.profilePhotos || [],
            })
        }
    }, [user])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddressChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }))
    }

    const handleRoleUpdate = (index: number, value: string) => {
        const role = (Object.values(RoleEnum).find(key => roleMap[Number(key) as RoleEnum] === value) as unknown as RoleEnum) || RoleEnum.User
        setFormData((prev) => {
            const newRoles = [...prev.roles]
            newRoles[index] = role
            return { ...prev, roles: newRoles }
        })
    }

    const handleAddRole = () => {
        setFormData((prev: any) => {
            const availableRoles = Object.values(RoleEnum)
                .filter(r => !prev.roles.includes(r) && r !== RoleEnum.User)  // Exclude User if already present
            const newRole = availableRoles.length ? availableRoles[0] : RoleEnum.User
            return { ...prev, roles: [...prev.roles, newRole] }
        })
    }

    const handleRemoveRole = (index: number) => {
        setFormData((prev) => {
            if (prev.roles.length <= 1) return prev // Ensure at least one role
            const newRoles = prev.roles.filter((_, i) => i !== index)
            return { ...prev, roles: newRoles }
        })
    }

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            status: value as StatusEnum,
        }))
    }

    const uploadProfilePhoto = async (file: File) => {
        try {
            const response = await userApi.uploadProfile(file)
            const newFilename = response.data
            setFormData((prev) => ({
                ...prev,
                profilePhotos: [...(prev.profilePhotos || []), newFilename],
            }))
            toast.success("Profile photo uploaded successfully")
        } catch (error) {
            toast.error("Failed to upload profile photo")
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 3 - (formData.profilePhotos?.length || 0))
            setProfilePhotos((prev) => [...prev, ...filesArray].slice(0, 3))

            for (const file of filesArray) {
                await uploadProfilePhoto(file)
            }
            setProfilePhotos((prev) => prev.filter((f) => !filesArray.includes(f)))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?._id) return
        onSave(formData) // Call parent onSave to update state
        onClose()
    }

    if (!user) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader className="relative">
                    <DialogTitle className="flex items-center gap-2 text-2xl font-bold gradient-text">
                        <LiaUserEditSolid className="w-10 h-10 text-blue-400" />
                        Edit User
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

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="role">Roles</Label>
                                {formData.roles.map((role, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Select value={roleMap[role]} onValueChange={(value) => handleRoleUpdate(index, value)}>
                                            <SelectTrigger className="border-blue-200 w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white pt-0 mt-0">
                                                {Object.values(RoleEnum).map(r => (
                                                    <SelectItem key={r} value={roleMap[r as number]}>{roleMap[r as number]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {index > 0 && (
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveRole(index)} className="group bg-blue-50 hover:bg-red-200">
                                                <FaMinus className="text-gray-400 group-hover:text-gray-600" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={handleAddRole} className="mt-2">
                                    <FaPlus className="mr-2" /> Add Role
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                    <SelectTrigger className="border-blue-200">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={StatusEnum.Active}>Active</SelectItem>
                                        <SelectItem value={StatusEnum.Inactive}>Inactive</SelectItem>
                                        <SelectItem value={StatusEnum.Pending}>Pending</SelectItem>
                                        <SelectItem value={StatusEnum.Suspended}>Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Address Information</h4>

                        <div className="space-y-2">
                            <Label htmlFor="street">Street Address</Label>
                            <Input
                                id="street"
                                value={formData.address.street}
                                onChange={(e) => handleAddressChange("street", e.target.value)}
                                className="border-blue-200 focus:border-blue-400"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.address.city}
                                    onChange={(e) => handleAddressChange("city", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                    id="state"
                                    value={formData.address.state}
                                    onChange={(e) => handleAddressChange("state", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={formData.address.country}
                                    onChange={(e) => handleAddressChange("country", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input
                                    id="zipCode"
                                    value={formData.address.zipCode}
                                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                                    className="border-blue-200 focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={onClose}>
                            <FaTimes className="mr-2" />
                            Cancel
                        </Button>
                        <Button type="submit" className="gradient-primary text-white hover:opacity-90">
                            <FaSave className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
