"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileInfoTab from "@/components/profile/ProfileInfoTab"
import SecurityTab from "@/components/profile/SecurityTab"
import PhotosTab from "@/components/profile/PhotosTab"
import SettingsTab from "@/components/profile/SettingsTab"
import { User, Shield, Camera, Settings } from "lucide-react"

// Mock user data - in real app, this would come from API/database
const mockUser = {
  id: "user_001",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  role: "buyer",
  status: "active",
  avatar: "/professional-headshot.png",
  joinDate: "2024-01-15",
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "United States",
    zipCode: "10001",
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    propertyAlerts: true,
    newsletter: true,
    language: "en",
    timezone: "EST",
    theme: "light",
    currency: "USD",
    measurementUnit: "imperial",
  },
  stats: {
    propertiesViewed: 45,
    savedProperties: 12,
    inquiriesSent: 8,
    toursScheduled: 3,
  },
  profilePhotos: ["/professional-headshot.png", "/casual-photo.jpg", "/professional-business-attire.png"],
}

export default function UserProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [activeTab, setActiveTab] = useState("profile")

  const handleUserUpdate = (updatedData: Partial<typeof user>) => {
    setUser((prev) => ({ ...prev, ...updatedData }))
    // In real app, make API call to update user
    console.log("User updated:", updatedData)
  }

  const handleAvatarChange = () => {
    // Handle avatar change logic
    console.log("Avatar change requested")
  }

  const handlePhotoUpload = (file: File) => {
    // Handle photo upload logic
    console.log("Photo upload:", file.name)
  }

  const handlePhotoDelete = (index: number) => {
    const updatedPhotos = user.profilePhotos.filter((_, i) => i !== index)
    setUser((prev) => ({ ...prev, profilePhotos: updatedPhotos }))
  }

  const handleSetAvatar = (photoUrl: string) => {
    setUser((prev) => ({ ...prev, avatar: photoUrl }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader user={user} onAvatarChange={handleAvatarChange} />
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-2 border border-white/20">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-blue-50"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-red-50"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-green-50"
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Photos</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-purple-50"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileInfoTab user={user} onSave={handleUserUpdate} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <PhotosTab
              profilePhotos={user.profilePhotos}
              currentAvatar={user.avatar}
              userName={`${user.firstName} ${user.lastName}`}
              onPhotoUpload={handlePhotoUpload}
              onPhotoDelete={handlePhotoDelete}
              onSetAvatar={handleSetAvatar}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTab preferences={user.preferences} onSave={handleUserUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
