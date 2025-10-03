"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FiSave, FiX } from "react-icons/fi"

interface EditNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  notification: any
  onSave: (notification: any) => void
}

export default function EditNotificationModal({ isOpen, onClose, notification, onSave }: EditNotificationModalProps) {
  const [formData, setFormData] = useState({
    message: notification?.message || "",
    type: notification?.type || "in-app",
    allowedRoles: notification?.allowedRoles || [],
    purpose: notification?.purpose || "",
  })

  const roleOptions = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Agent" },
    { id: 3, name: "Seller" },
    { id: 4, name: "Renter" },
    { id: 5, name: "User" },
  ]

  const purposeOptions = [
    "PROPERTY_CREATED",
    "AGENT_APPROVED",
    "AGENT_REJECTED",
    "PROPERTY_SOLD",
    "PROPERTY_LISTED",
    "USER_REGISTERED",
    "ROLE_REQUEST",
    "DEAL_REQUEST",
  ]

  const handleSave = () => {
    onSave({ ...notification, ...formData })
    onClose()
  }

  const handleRoleChange = (roleId: number, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        allowedRoles: [...prev.allowedRoles, roleId],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        allowedRoles: prev.allowedRoles.filter((id: any) => id !== roleId),
      }))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Edit Notification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-gray-700">
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="min-h-[100px] border-2 border-blue-200 focus:border-blue-500 rounded-lg"
              placeholder="Enter notification message..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-app">In-App</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Purpose</Label>
              <Select
                value={formData.purpose}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, purpose: value }))}
              >
                <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {purposeOptions.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Allowed Roles</Label>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <div key={role.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`role-${role.id}`}
                    checked={formData.allowedRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                    className="border-2 border-blue-300"
                  />
                  <Label htmlFor={`role-${role.id}`} className="text-sm text-gray-600">
                    {role.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 border-2 border-gray-300 hover:border-gray-400 bg-transparent"
          >
            <FiX className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            <FiSave className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
