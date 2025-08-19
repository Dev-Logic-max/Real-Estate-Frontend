"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FiX, FiPlus, FiUser, FiAward, FiFileText } from "react-icons/fi"

interface AddAgentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddAgentModal({ open, onOpenChange }: AddAgentModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    license: "",
    commissionRate: "",
    bio: "",
    status: "pending",
    specializations: [] as string[],
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  })

  const [newSpecialization, setNewSpecialization] = useState("")

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const addSpecialization = () => {
    if (newSpecialization.trim() && !formData.specializations.includes(newSpecialization.trim())) {
      setFormData((prev) => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()],
      }))
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.filter((s) => s !== spec),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("New agent data:", formData)
    onOpenChange(false)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      license: "",
      commissionRate: "",
      bio: "",
      status: "pending",
      specializations: [],
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
            <FiUser className="mr-2 h-6 w-6 text-blue-600" />
            Add New Agent
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiUser className="mr-2 h-5 w-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiAward className="mr-2 h-5 w-5 text-green-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="license" className="text-sm font-medium text-gray-700">
                  License Number
                </Label>
                <Input
                  id="license"
                  value={formData.license}
                  onChange={(e) => handleInputChange("license", e.target.value)}
                  className="mt-1 border-green-200 focus:border-green-400"
                  placeholder="Will be auto-generated if empty"
                />
              </div>
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="mt-1 border-green-200 focus:border-green-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="commissionRate" className="text-sm font-medium text-gray-700">
                  Commission Rate (%) *
                </Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.1"
                  required
                  value={formData.commissionRate}
                  onChange={(e) => handleInputChange("commissionRate", e.target.value)}
                  className="mt-1 border-green-200 focus:border-green-400"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street" className="text-sm font-medium text-gray-700">
                  Street Address
                </Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange("address.street", e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  City
                </Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange("address.city", e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  State
                </Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange("address.state", e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                  Country
                </Label>
                <Input
                  id="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange("address.country", e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
              <div>
                <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                  Zip Code
                </Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange("address.zipCode", e.target.value)}
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Specializations</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add specialization..."
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="border-orange-200 focus:border-orange-400"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
                />
                <Button
                  type="button"
                  onClick={addSpecialization}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border border-orange-200"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700 flex items-center">
              <FiFileText className="mr-2 h-4 w-4 text-blue-600" />
              Bio
            </Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="mt-1 border-blue-200 focus:border-blue-400"
              placeholder="Enter agent bio..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
