"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Mail, MessageSquare, Globe, Smartphone, Shield, Download, Trash2 } from "lucide-react"

interface SettingsTabProps {
  preferences: {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    propertyAlerts: boolean
    newsletter: boolean
    language: string
    timezone: string
    theme: string
    currency: string
    measurementUnit: string
  }
  onSave: (preferences: any) => void
}

export default function SettingsTab({ preferences, onSave }: SettingsTabProps) {
  const [settings, setSettings] = useState(preferences)
  const [isSaving, setIsSaving] = useState(false)

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    onSave(settings)
    setIsSaving(false)
  }

  const handleExportData = () => {
    // Handle data export
    console.log("Exporting user data...")
  }

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested...")
  }

  return (
    <div className="space-y-6">
      {/* Notifications Settings */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Notification Preferences</CardTitle>
              <CardDescription className="text-gray-600">
                Choose how you want to be notified about updates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <Label className="text-sm font-medium text-gray-900">Email Notifications</Label>
                  <p className="text-xs text-gray-600">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(value) => handleSwitchChange("emailNotifications", value)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="text-sm font-medium text-gray-900">SMS Notifications</Label>
                  <p className="text-xs text-gray-600">Receive updates via text message</p>
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(value) => handleSwitchChange("smsNotifications", value)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-purple-600" />
                <div>
                  <Label className="text-sm font-medium text-gray-900">Property Alerts</Label>
                  <p className="text-xs text-gray-600">Get notified about new properties</p>
                </div>
              </div>
              <Switch
                checked={settings.propertyAlerts}
                onCheckedChange={(value) => handleSwitchChange("propertyAlerts", value)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-600"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-600" />
                <div>
                  <Label className="text-sm font-medium text-gray-900">Marketing Emails</Label>
                  <p className="text-xs text-gray-600">Receive promotional content</p>
                </div>
              </div>
              <Switch
                checked={settings.marketingEmails}
                onCheckedChange={(value) => handleSwitchChange("marketingEmails", value)}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display & Language Settings */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Display & Language</CardTitle>
              <CardDescription className="text-gray-600">Customize your viewing experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSelectChange("language", value)}>
                <SelectTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => handleSelectChange("timezone", value)}>
                <SelectTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                  <SelectItem value="CST">Central Time (CST)</SelectItem>
                  <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                  <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Currency</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSelectChange("currency", value)}>
                <SelectTrigger className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                  <SelectItem value="CAD">Canadian Dollar (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Measurement Unit</Label>
              <Select
                value={settings.measurementUnit}
                onValueChange={(value) => handleSelectChange("measurementUnit", value)}
              >
                <SelectTrigger className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imperial">Imperial (ft, miles)</SelectItem>
                  <SelectItem value="metric">Metric (m, km)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50/30 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Privacy & Security</CardTitle>
              <CardDescription className="text-gray-600">Manage your data and account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100"
              onClick={handleExportData}
            >
              <Download className="h-5 w-5 mr-3 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Export My Data</div>
                <div className="text-sm text-gray-600">Download a copy of your account data</div>
              </div>
            </Button>

            <Separator className="bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:from-red-100 hover:to-rose-100 text-red-700"
              onClick={handleDeleteAccount}
            >
              <Trash2 className="h-5 w-5 mr-3 text-red-600" />
              <div className="text-left">
                <div className="font-medium">Delete Account</div>
                <div className="text-sm text-red-600">Permanently delete your account and data</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
