"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FaUserPlus,
  FaIdCard,
  FaGraduationCap,
  FaHandshake,
  FaDollarSign,
  FaMapMarkerAlt,
  FaLanguage,
  FaBuilding,
  FaUsers,
  FaUpload,
} from "react-icons/fa"
import { MdBusinessCenter, MdVerified } from "react-icons/md"

export default function AgentRegisterPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Agent registration submitted:", formData)
    setIsModalOpen(false)
    // Handle form submission
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <FaUserPlus className="text-6xl mb-6 mx-auto text-green-200" />
          <h1 className="text-5xl font-bold mb-4 text-shadow-lg">Join Our Elite Agent Network</h1>
          <p className="text-xl mb-8 text-blue-100">
            Take your real estate career to the next level with our comprehensive platform and support system
          </p>
          <div className="flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 flex items-center gap-4">
              <FaUsers className="text-yellow-300" />
              <span className="text-lg font-semibold">500+ Active Agents</span>
              <div className="w-px h-6 bg-white/30"></div>
              <FaDollarSign className="text-green-300" />
              <span className="text-lg font-semibold">$2B+ in Sales</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Platform?</h2>
          <p className="text-gray-600">Join thousands of successful agents who trust our platform</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHandshake className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Leads</h3>
              <p className="text-gray-600">Get access to high-quality, pre-qualified leads in your area</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaGraduationCap className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Training & Support</h3>
              <p className="text-gray-600">Comprehensive training programs and ongoing support</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdBusinessCenter className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Marketing Tools</h3>
              <p className="text-gray-600">Professional marketing materials and digital tools</p>
            </CardContent>
          </Card>
        </div>

        {/* Registration CTA */}
        <div className="text-center">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold px-12 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <FaUserPlus className="mr-2" />
                Register as Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center text-gray-800 mb-4">
                  Agent Registration Form
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
                    <MdVerified className="text-green-600" />
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
                        className="border-2 border-pink-200 focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Professional ID</label>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="border-2 border-pink-200 focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 border-2 border-gray-300 hover:border-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Success Stories */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-gray-600">Hear from our top-performing agents</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Top Luxury Agent",
                image: "/placeholder.svg?height=100&width=100",
                quote:
                  "Joining this platform transformed my career. The lead quality and support system are unmatched.",
                stats: "$24.5M in sales",
              },
              {
                name: "Michael Chen",
                role: "Rising Star",
                image: "/placeholder.svg?height=100&width=100",
                quote: "The training programs helped me close 156 deals in my first two years. Incredible growth!",
                stats: "156 deals closed",
              },
              {
                name: "Emily Rodriguez",
                role: "Commercial Expert",
                image: "/placeholder.svg?height=100&width=100",
                quote: "The commercial leads and networking opportunities have been game-changing for my business.",
                stats: "$31.8M commercial volume",
              },
            ].map((story, index) => (
              <Card
                key={index}
                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-0">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    width={80}
                    height={80}
                    className="rounded-full mx-auto mb-4 border-4 border-blue-200"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{story.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{story.role}</p>
                  <p className="text-gray-600 italic mb-4">"{story.quote}"</p>
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">{story.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
