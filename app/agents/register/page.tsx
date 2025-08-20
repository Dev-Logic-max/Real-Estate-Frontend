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
import AgentRequestModal from "@/components/modals/AgentRequestModal"

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

    const handleRequestSent = () => {
        console.log("Request sent, awaiting admin approval")
        // Additional logic if needed after request is sent
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
                        <AgentRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRequestSent={handleRequestSent} />
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
