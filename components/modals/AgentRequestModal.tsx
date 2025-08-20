"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { agentApi } from "@/lib/api/agent"
import { toast } from "react-toastify"
import {
  FaIdCard,
  FaGraduationCap,
  FaDollarSign,
  FaMapMarkerAlt,
  FaLanguage,
  FaBuilding,
  FaUpload,
} from "react-icons/fa"
import { useAuth } from "@/hooks/useAuth"

interface AgentRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onRequestSent: () => void
}

export default function AgentRequestModal({ isOpen, onClose, onRequestSent }: AgentRequestModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    license: "",
    yearsExperience: "",
    bio: "",
    specialties: [] as string[],
    languages: [] as string[],
    serviceAreas: "",
    commissionRate: "",
    documents: [] as File[],
  })

  const { user } = useAuth()

  const specialtyOptions = [
    "Luxury Homes",
    "First-Time Buyers",
    "Commercial",
    "Investment Properties",
    "Relocation",
    "Multi-Family",
    "Condos",
    "Waterfront",
    "Rural Properties",
  ]

  const languageOptions = ["English", "Spanish", "Mandarin", "Cantonese", "French", "Korean", "Japanese", "German"]

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        specialties: prev.specialties.filter((s) => s !== specialty),
      }))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, language],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        languages: prev.languages.filter((l) => l !== language),
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData((prev) => ({
        ...prev,
        documents: files,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone || !formData.license || !formData.bio) {
      toast.error("Please fill all required fields")
      return
    }

    try {
      const createAgentDto = {
        userId: user?.id || '',
        license: formData.license,
        commissionRate: parseFloat(formData.commissionRate) || 0,
        bio: formData.bio,
        phone: formData.phone,
      }

      const userId = user?.id || 'currentUserId'

      // Send request to backend
      const response = await agentApi.requestAgent(userId, createAgentDto) // Replace with actual userId from auth
      console.log("Agent request response:", response)

      toast.success("Agent request sent successfully. Awaiting admin approval.")
      onRequestSent()
      onClose()
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        license: "",
        yearsExperience: "",
        bio: "",
        specialties: [],
        languages: [],
        serviceAreas: "",
        commissionRate: "",
        documents: [],
      })
    } catch (error) {
      toast.error("Failed to send agent request")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-4">
            Agent Registration Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FaIdCard className="text-blue-600" />
              Personal Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <Input
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="border-2 border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <Input
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="border-2 border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="border-2 border-blue-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <Input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="border-2 border-blue-200 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-green-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FaGraduationCap className="text-green-600" />
              Professional Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                <Input
                  required
                  value={formData.license}
                  onChange={(e) => setFormData((prev) => ({ ...prev, license: e.target.value }))}
                  className="border-2 border-green-200 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                <Select
                  value={formData.yearsExperience}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, yearsExperience: value }))}
                >
                  <SelectTrigger className="border-2 border-green-200 focus:border-green-500">
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="11-15">11-15 years</SelectItem>
                    <SelectItem value="15+">15+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
              <Textarea
                required
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="border-2 border-green-200 focus:border-green-500"
                placeholder="Tell us about your experience and what makes you unique..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={formData.commissionRate}
                onChange={(e) => setFormData((prev) => ({ ...prev, commissionRate: e.target.value }))}
                className="border-2 border-green-200 focus:border-green-500"
                placeholder="e.g., 2.5"
              />
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-purple-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
              <FaBuilding className="text-purple-600" />
              Specialties
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {specialtyOptions.map((specialty) => (
                <div key={specialty} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty}
                    checked={formData.specialties.includes(specialty)}
                    onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                  />
                  <label htmlFor={specialty} className="text-sm text-gray-700">
                    {specialty}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-orange-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
              <FaLanguage className="text-orange-600" />
              Languages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languageOptions.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={formData.languages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                  />
                  <label htmlFor={language} className="text-sm text-gray-700">
                    {language}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div className="bg-teal-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-teal-800 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-teal-600" />
              Service Areas
            </h3>
            <Textarea
              rows={3}
              value={formData.serviceAreas}
              onChange={(e) => setFormData((prev) => ({ ...prev, serviceAreas: e.target.value }))}
              className="border-2 border-teal-200 focus:border-teal-500"
              placeholder="List the areas you serve (e.g., Downtown, Waterfront District, Luxury Hills)"
            />
          </div>

          {/* Documents */}
          <div className="bg-pink-50 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center gap-2">
              <FaUpload className="text-pink-600" />
              Required Documents
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Real Estate License</label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e)}
                  className="border-2 border-pink-200 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional ID</label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e)}
                  className="border-2 border-pink-200 focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}