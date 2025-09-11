"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Edit3, MapPin } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
}

interface ProfileInfoTabProps {
  user: User
  onSave?: (updatedUser: Partial<User>) => void
}

export default function ProfileInfoTab({ user, onSave }: ProfileInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(user)

  const handleSave = () => {
    onSave?.(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(user)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-sm ring-1 ring-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900">Personal Information</CardTitle>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={
                isEditing
                  ? "border-blue-200 text-blue-600 hover:bg-blue-50"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              }
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
              disabled={!isEditing}
            >
              <SelectTrigger className="mt-1 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500 disabled:bg-gray-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white/90 to-purple-50/50 backdrop-blur-sm ring-1 ring-white/20">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl text-gray-900">Address Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="street" className="text-sm font-medium text-gray-700">
              Street Address
            </Label>
            <Input
              id="street"
              value={formData.address.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                })
              }
              disabled={!isEditing}
              className="mt-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500 disabled:bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                State
              </Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                Country
              </Label>
              <Input
                id="country"
                value={formData.address.country}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, country: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500 disabled:bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={formData.address.zipCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value },
                  })
                }
                disabled={!isEditing}
                className="mt-1 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
