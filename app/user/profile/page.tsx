"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import { FaUser, FaCog, FaCamera, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit } from "react-icons/fa"
import { FiShield } from "react-icons/fi";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phone: "+1 5551234567",
    location: "San Francisco, USA",
    role: "Developer",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile header */}
          <Card className="mb-8 shadow-lg hover-lift">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 gradient-primary">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" />
                    <AvatarFallback className="text-white text-4xl font-bold">
                      {userInfo.firstName[0]}
                      {userInfo.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 rounded-full gradient-secondary text-white shadow-lg"
                  >
                    <FaCamera />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    {userInfo.firstName} {userInfo.lastName}
                  </h1>
                  <Badge className="gradient-primary text-white mb-4">{userInfo.role}</Badge>

                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center justify-center md:justify-start">
                      <FaEnvelope className="text-blue-500 mr-2" />
                      <span>{userInfo.email}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <FaPhone className="text-green-500 mr-2" />
                      <span>{userInfo.phone}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span>{userInfo.location}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="gradient-warning text-white hover:opacity-90 transition-all duration-300"
                >
                  <FaEdit className="mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white"
              >
                <FaUser className="text-blue-500" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-2 data-[state=active]:gradient-secondary data-[state=active]:text-white"
              >
                <FiShield className="text-green-500" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2 data-[state=active]:gradient-success data-[state=active]:text-white"
              >
                <FaCog className="text-purple-500" />
                Preferences
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="gradient-text">Account Settings</CardTitle>
                  <p className="text-gray-600">Manage your account information and preferences</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 font-medium">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={userInfo.firstName}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo((prev) => ({ ...prev, firstName: e.target.value }))}
                        className="mt-1 border-2 border-purple-200 focus:border-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 font-medium">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={userInfo.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))}
                        className="mt-1 border-2 border-purple-200 focus:border-purple-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      disabled={!isEditing}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1 border-2 border-purple-200 focus:border-purple-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      disabled={!isEditing}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, phone: e.target.value }))}
                      className="mt-1 border-2 border-purple-200 focus:border-purple-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location" className="text-gray-700 font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={userInfo.location}
                      disabled={!isEditing}
                      onChange={(e) => setUserInfo((prev) => ({ ...prev, location: e.target.value }))}
                      className="mt-1 border-2 border-purple-200 focus:border-purple-500 disabled:bg-gray-50"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-300">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="gradient-text-blue">Change Password</CardTitle>
                  <p className="text-gray-600">Update your password to keep your account secure</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="currentPassword" className="text-gray-700 font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="mt-1 border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="mt-1 border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="mt-1 border-2 border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <Button className="gradient-secondary text-white hover:opacity-90 transition-all duration-300">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-600">Preferences</CardTitle>
                  <p className="text-gray-600">Customize your experience</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive updates about your properties</p>
                      </div>
                      <Button className="gradient-success text-white">Enabled</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">SMS Alerts</h3>
                        <p className="text-sm text-gray-600">Get instant notifications on your phone</p>
                      </div>
                      <Button variant="outline" className="border-gray-300 bg-transparent">
                        Disabled
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Marketing Emails</h3>
                        <p className="text-sm text-gray-600">Receive promotional content and offers</p>
                      </div>
                      <Button className="gradient-warning text-white">Enabled</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
