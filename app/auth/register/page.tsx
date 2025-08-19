"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { FaGoogle, FaApple, FaEye, FaEyeSlash, FaHome } from "react-icons/fa"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const propertyImages = [
    { src: "/placeholder.svg?height=600&width=800", alt: "Colorful residential houses" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Modern apartment complex" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Luxury villa" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image slider */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <AutoImageSlider images={propertyImages} className="w-full h-full" objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 to-blue-900/50 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center mr-3">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold">RealEstate Pro</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-shadow-lg">Manage Properties Efficiently</h2>
            <p className="text-xl text-white/90 text-shadow">
              Easily track rent payments, maintenance requests, and tenant communications in one place. Say goodbye to
              the hassle of manual management.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-10 h-10 gradient-success rounded-lg flex items-center justify-center mr-2">
                <FaHome className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">RealEstate Pro</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to RealEstate Pro!</h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Register form */}
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="mt-1 h-12 border-2 border-green-200 focus:border-green-500 transition-all duration-300"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="mt-1 h-12 border-2 border-green-200 focus:border-green-500 transition-all duration-300"
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
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 h-12 border-2 border-green-200 focus:border-green-500 transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 pr-12 border-2 border-green-200 focus:border-green-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-12 pr-12 border-2 border-green-200 focus:border-green-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-green-600 hover:text-green-700 transition-colors">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 hover:text-green-700 transition-colors">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button className="w-full h-12 gradient-success text-white hover:opacity-90 transition-all duration-300 shadow-gradient">
              Create Account
            </Button>

            <div className="text-center">
              <span className="text-gray-500">or</span>
            </div>

            {/* Social login buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:bg-red-50 hover:border-red-200 transition-all duration-300 bg-transparent"
              >
                <FaGoogle className="mr-2 text-red-500" />
                Sign up with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 bg-transparent"
              >
                <FaApple className="mr-2 text-gray-800" />
                Sign up with Apple
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
