"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { FaUser, FaBell, FaLock, FaPalette, FaEye, FaEyeSlash } from "react-icons/fa"
import { FiShield } from "react-icons/fi";

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4">Settings</h1>
            <p className="text-xl text-gray-600">Manage your account preferences and settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-5 bg-white shadow-lg rounded-xl p-2">
              <TabsTrigger
                value="profile"
                className="flex items-center space-x-2 data-[state=active]:gradient-primary data-[state=active]:text-white"
              >
                <FaUser className="text-blue-500" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center space-x-2 data-[state=active]:gradient-secondary data-[state=active]:text-white"
              >
                <FaBell className="text-yellow-500" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center space-x-2 data-[state=active]:gradient-success data-[state=active]:text-white"
              >
                <FaLock className="text-green-500" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex items-center space-x-2 data-[state=active]:gradient-warning data-[state=active]:text-white"
              >
                <FaPalette className="text-purple-500" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="flex items-center space-x-2 data-[state=active]:gradient-danger data-[state=active]:text-white"
              >
                <FiShield className="text-red-500" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" className="focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" className="focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@example.com"
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      defaultValue="Real estate enthusiast with over 10 years of experience in property investment and management."
                    />
                  </div>
                  <Button className="gradient-primary text-white hover:opacity-90 shadow-gradient-blue">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text-secondary flex items-center">
                    <FaBell className="mr-2 text-yellow-500" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                      <div>
                        <h3 className="font-medium">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-pink-50 to-red-50">
                      <div>
                        <h3 className="font-medium">Marketing Communications</h3>
                        <p className="text-sm text-gray-600">Receive promotional emails and offers</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked: any) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>
                  </div>
                  <Button className="gradient-secondary text-white hover:opacity-90 shadow-gradient-yellow">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text-success flex items-center">
                    <FaLock className="mr-2 text-green-500" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className="focus:ring-2 focus:ring-green-500 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" className="focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" className="focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-teal-50">
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-3">Add an extra layer of security to your account</p>
                    <Badge className="bg-green-500 text-white">Enabled</Badge>
                  </div>

                  <Button className="gradient-success text-white hover:opacity-90 shadow-gradient-green">
                    Update Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text-warning flex items-center">
                    <FaPalette className="mr-2 text-purple-500" />
                    Appearance Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 cursor-pointer">
                          <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                          <p className="text-sm font-medium">Default</p>
                        </div>
                        <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-900 cursor-pointer">
                          <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                          <p className="text-sm font-medium text-white">Dark</p>
                        </div>
                        <div className="p-4 rounded-lg border-2 border-gray-300 bg-white cursor-pointer">
                          <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
                          <p className="text-sm font-medium">Light</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button className="gradient-warning text-white hover:opacity-90 shadow-gradient-purple">
                    Apply Theme
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card className="shadow-lg hover-lift">
                <CardHeader>
                  <CardTitle className="gradient-text-danger flex items-center">
                    {/* <FaShield className="mr-2 text-red-500" /> */}
                    <FiShield className="mr-2 text-red-500" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-red-50 to-pink-50">
                      <div>
                        <h3 className="font-medium">Profile Visibility</h3>
                        <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                      <div>
                        <h3 className="font-medium">Show Online Status</h3>
                        <p className="text-sm text-gray-600">Let others see when you're online</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <div>
                        <h3 className="font-medium">Data Analytics</h3>
                        <p className="text-sm text-gray-600">Allow us to collect anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button className="gradient-danger text-white hover:opacity-90 shadow-gradient-red">
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
