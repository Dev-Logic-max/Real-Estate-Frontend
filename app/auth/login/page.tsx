"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { FaGoogle, FaApple, FaEye, FaEyeSlash, FaHome } from "react-icons/fa"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading } = useAuth()

  const propertyImages = [
    { src: "/placeholder.svg?height=600&width=800", alt: "Luxury waterfront property" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Modern skyscraper" },
    { src: "/placeholder.svg?height=600&width=800", alt: "Residential neighborhood" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      // Success toast and redirect handled by useAuth
    } catch (error) {
      // Error toast handled by authApi interceptor
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image slider */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <AutoImageSlider images={propertyImages} className="w-full h-full" objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mr-3">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold">RealEstate Pro</span>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-shadow-lg">Find your sweet home</h2>
            <p className="text-xl text-white/90 text-shadow">
              Schedule visit in just a few clicks, visits in just a few clicks.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center mb-6">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mr-2">
                <FaHome className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">RealEstate Pro</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back to RealEstate Pro!</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Your Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="info.madhu786@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-12 border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-12 border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember Me
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* <Button className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink">
              Login
            </Button> */}

            <Button
              type="submit"
              className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 bg-transparent"
              >
                <FaApple className="mr-2 text-gray-800" />
                Sign in with Apple
              </Button>
            </div>

            <div className="text-center">
              <span className="text-gray-600">Don't have any account? </span>
              <Link
                href="/auth/register"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
