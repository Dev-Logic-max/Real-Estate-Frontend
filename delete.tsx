// header code

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  FaUser,
  FaBell,
  FaBookmark,
  FaHome,
  FaSellsy,
  FaUsers,
  FaTools,
  FaBuilding,
  FaTachometerAlt,
  FaSignInAlt,
} from "react-icons/fa"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context
  const [notifications] = useState([
    { id: 1, title: "New property match found!", type: "success" },
    { id: 2, title: "Price drop alert", type: "warning" },
    { id: 3, title: "Tour scheduled", type: "info" },
  ])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">RealEstate Pro</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/properties">
              <Button
                variant="ghost"
                className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
              >
                <FaHome className="mr-2 text-purple-500" />
                Properties
              </Button>
            </Link>
            <Link href="/sell-rent">
              <Button
                variant="ghost"
                className="text-green-600 hover:bg-green-50 hover:text-green-700 transition-all duration-300"
              >
                <FaSellsy className="mr-2 text-green-500" />
                Sell/Rent
              </Button>
            </Link>
            <Link href="/agents">
              <Button
                variant="ghost"
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
              >
                <FaUsers className="mr-2 text-blue-500" />
                Agents
              </Button>
            </Link>
            <Link href="/tools">
              <Button
                variant="ghost"
                className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 transition-all duration-300"
              >
                <FaTools className="mr-2 text-orange-500" />
                User Tools
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                variant="ghost"
                className="text-pink-600 hover:bg-pink-50 hover:text-pink-700 transition-all duration-300"
              >
                <FaBuilding className="mr-2 text-pink-500" />
                Projects
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
              >
                <FaTachometerAlt className="mr-2 text-indigo-500" />
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-yellow-50 transition-all duration-300"
                    >
                      <FaBell className="text-yellow-600 text-lg" />
                      {notifications.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-600">
                          {notifications.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-3 border-b">
                      <h3 className="font-semibold gradient-text-primary">Notifications</h3>
                    </div>
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }`}
                          />
                          <span className="text-sm">{notification.title}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Save for Later */}
                <Link href="/saved">
                  <Button variant="ghost" size="icon" className="hover:bg-green-50 transition-all duration-300">
                    <FaBookmark className="text-green-600 text-lg" />
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-blue-50 transition-all duration-300">
                      <FaUser className="text-blue-600 text-lg" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
                      <Link href="/profile" className="flex items-center w-full">
                        <FaUser className="mr-2 text-blue-500" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50">
                      <Link href="/notifications" className="flex items-center w-full">
                        <FaBell className="mr-2 text-yellow-500" />
                        Notifications
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50">
                      <Link href="/settings" className="flex items-center w-full">
                        <FaTools className="mr-2 text-green-500" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-red-600">
                      <button onClick={() => setIsLoggedIn(false)} className="flex items-center w-full">
                        <FaSignInAlt className="mr-2 text-red-500" />
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth/login">
                <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink">
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// Hero section


"use client"

import { Input } from "@/components/ui/input"
import { FaSearch, FaMapMarkerAlt, FaDollarSign } from "react-icons/fa"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const cities = [
    { name: "New York", color: "text-blue-500" },
    { name: "Los Angeles", color: "text-purple-500" },
    { name: "Miami", color: "text-pink-500" },
    { name: "Chicago", color: "text-green-500" },
    { name: "San Francisco", color: "text-orange-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [cities.length])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
        }}
      >
        <div className="absolute inset-0 animated-gradient opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animated heading */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white text-shadow-xl mb-4">
            <span className="gradient-text-blue">Explore</span> <span className="text-white">Your</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white text-shadow-xl mb-6">
            <span className="gradient-text-primary">New Beginning</span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 text-shadow mb-2">
            Discover beautiful properties in amazing locations
          </p>
          <p className="text-xl md:text-2xl text-white/90 text-shadow mb-2">
            Discover beautiful properties in{" "}
            <span className={`font-bold transition-all duration-500 ${cities[currentCityIndex].color}`}>
              {cities[currentCityIndex].name}
            </span>
          </p>
          <p className="text-lg text-white/80 text-shadow">
            Get the best real estate deals and explore luxury homes in the most sought-after locations
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-12 animate-slide-in">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">20+</div>
            <div className="text-white/80 text-shadow">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">800+</div>
            <div className="text-white/80 text-shadow">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">1450+</div>
            <div className="text-white/80 text-shadow">Happy Clients</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
              <Input
                placeholder="Search by location, property type, or price range..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
              />
            </div>
            <Button className="h-12 px-8 gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink">
              <FaSearch className="mr-2" />
              Search
            </Button>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <FaHome className="mr-1 text-blue-500" />
              Buy
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
            >
              <FaHome className="mr-1 text-green-500" />
              Rent
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
            >
              <FaDollarSign className="mr-1 text-orange-500" />
              Mortgage
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}


// 

{/* Notifications Icon */}
            // <DropdownMenu>
            //   <DropdownMenuTrigger asChild>
            //     <Button variant="ghost" size="icon" className="relative hover:bg-yellow-50 transition-all duration-300">
            //       <FaBell className="text-yellow-600 text-lg" />
            //       {notifications.length > 0 && (
            //         <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-600">
            //           {notifications.length}
            //         </Badge>
            //       )}
            //     </Button>
            //   </DropdownMenuTrigger>
            //   <DropdownMenuContent align="end" className="w-80">
            //     <div className="p-3 border-b">
            //       <h3 className="font-semibold gradient-text-primary">Notifications</h3>
            //     </div>
            //     {notifications.map((notification) => (
            //       <DropdownMenuItem
            //         key={notification.id}
            //         className="p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
            //       >
            //         <div className="flex items-start space-x-3">
            //           <div
            //             className={`w-2 h-2 rounded-full mt-2 ${
            //               notification.type === "success"
            //                 ? "bg-green-500"
            //                 : notification.type === "warning"
            //                   ? "bg-yellow-500"
            //                   : "bg-blue-500"
            //             }`}
            //           />
            //           <span className="text-sm">{notification.title}</span>
            //         </div>
            //       </DropdownMenuItem>
            //     ))}
            //   </DropdownMenuContent>
            // </DropdownMenu>


            {/* Add to Favorites Icon */}
            // <Link href="/saved">
            //   <Button variant="ghost" size="icon" className="hover:bg-green-50 transition-all duration-300">
            //     <FaBookmark className="text-green-600 text-lg" />
            //   </Button>
            // </Link>



// Latest edit user modal

"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaEnvelope, FaMinus, FaPhone, FaPlus, FaSave, FaTimes } from "react-icons/fa"
import { RoleEnum, StatusEnum, User } from "@/types"
import { roleMap } from "@/utils"
import { userApi } from "@/lib/api/user"
import { toast } from "react-toastify"
import { FiUpload } from "react-icons/fi"
import { PiUserCircleCheckDuotone } from "react-icons/pi"

interface UserEditModalProps {
    user: User | null
    isOpen: boolean
    onClose: () => void
    onSave: (userData: Partial<User>) => void
}

export default function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
    const [profilePhotos, setProfilePhotos] = useState<File[]>([])
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        // role: user?.roles || [RoleEnum.User],
        roles: user?.roles.length ? [...user.roles] : [RoleEnum.User], // Ensure at least User role
        status: user?.status || StatusEnum.Active,
        address: {
            street: user?.address?.street || "",
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            zipCode: user?.address?.zipCode || "",
        },
        profilePhotos: user?.profilePhotos || [],
    })

    // Sync formData with user prop when it changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                roles: user.roles.length ? [...user.roles] : [RoleEnum.User],
                status: user.status || StatusEnum.Active,
                address: {
                    street: user.address?.street || "",
                    city: user.address?.city || "",
                    state: user.address?.state || "",
                    country: user.address?.country || "",
                    zipCode: user.address?.zipCode || "",
                },
                profilePhotos: user?.profilePhotos || [],
            })
        }
    }, [user])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleAddressChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value,
            },
        }))
    }

    const handleRoleUpdate = (index: number, value: string) => {
        const role = (Object.values(RoleEnum).find(key => roleMap[Number(key) as RoleEnum] === value) as unknown as RoleEnum) || RoleEnum.User
        setFormData((prev) => {
            const newRoles = [...prev.roles]
            newRoles[index] = role
            return { ...prev, roles: newRoles }
        })
    }

    const handleAddRole = () => {
        setFormData((prev: any) => {
            const availableRoles = Object.values(RoleEnum)
            .filter(r => !prev.roles.includes(r)&& r !== RoleEnum.User)  // Exclude User if already present
            const newRole = availableRoles.length ? availableRoles[0] : RoleEnum.User
            return { ...prev, roles: [...prev.roles, newRole] }
        })
    }

    const handleRemoveRole = (index: number) => {
        setFormData((prev) => {
            if (prev.roles.length <= 1) return prev // Ensure at least one role
            const newRoles = prev.roles.filter((_, i) => i !== index)
            return { ...prev, roles: newRoles }
        })
    }

    const handleStatusChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            status: value as StatusEnum,
        }))
    }

    const uploadProfilePhoto = async (file: File) => {
        try {
            const response = await userApi.uploadProfile(file)
            const newFilename = response.data
            setFormData((prev) => ({
                ...prev,
                profilePhotos: [...(prev.profilePhotos || []), newFilename],
            }))
            toast.success("Profile photo uploaded successfully")
        } catch (error) {
            toast.error("Failed to upload profile photo")
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files).slice(0, 3 - (formData.profilePhotos?.length || 0))
            setProfilePhotos((prev) => [...prev, ...filesArray].slice(0, 3))

            for (const file of filesArray) {
                await uploadProfilePhoto(file)
            }
            setProfilePhotos((prev) => prev.filter((f) => !filesArray.includes(f)))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?._id) return
        // try {
        //     await userApi.updateById(user._id, {
        //         firstName: formData.firstName,
        //         lastName: formData.lastName,
        //         email: formData.email,
        //         phone: formData.phone,
        //         roles: formData.roles,
        //         status: formData.status,
        //         address: formData.address,
        //     })
        //     onSave(formData) 
        //     toast.success("User updated successfully")
        //     onClose()
        // } catch (error) {
        //     toast.error("Failed to update user")
        // }
        onSave(formData) // Call parent onSave to update state
        onClose()
    }

    if (!user) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-blue-300 shadow-lg">
                <DialogHeader className="relative">
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                        <PiUserCircleCheckDuotone className="w-10 h-10 text-green-400" />
                        Edit User
                    </DialogTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="absolute right-2 top-0 text-gray-500 bg-gray-100 hover:text-red-600 hover:bg-red-100 transition-colors"
                    >
                        <FaTimes className="h-5 w-5" />
                    </Button>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm flex justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2 justify-center">
                                <FaUser className="text-blue-500" />
                                Profile Picture
                            </h3>
                            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                {(formData.profilePhotos?.length ?? 0) > 0 ? (
                                    <img
                                        src={`http://localhost:3010/uploads/${formData.profilePhotos![formData.profilePhotos!.length - 1]}`}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : profilePhotos.length > 0 ? (
                                    <img
                                        src={URL.createObjectURL(profilePhotos[profilePhotos.length - 1])}
                                        alt="Profile Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-500">No Image</span>
                                )}
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="profilePhoto" className="text-blue-900 font-medium flex items-center gap-2 justify-center">
                                    <FiUpload className="w-5 h-5 text-green-500" />
                                    Update Photo (max 3)
                                </Label>
                                <Input
                                    id="profilePhoto"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleFileChange}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300 mt-2"
                                    multiple
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <FaUser className="text-blue-500" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaUser className="text-blue-500" />
                                    First Name
                                </Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaUser className="text-blue-500" />
                                    Last Name
                                </Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaEnvelope className="text-green-500" />
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaPhone className="text-purple-500" />
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaUser className="text-orange-500" />
                                    Roles
                                </Label>
                                {formData.roles.map((role, index) => (
                                    <div key={index} className="flex items-center gap-2 mb-2">
                                        <Select value={roleMap[role]} onValueChange={(value) => handleRoleUpdate(index, value)}>
                                            <SelectTrigger className="border-blue-200 w-full focus:border-blue-500 focus:ring-blue-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white pt-0 mt-0">
                                                {Object.values(RoleEnum).map(r => (
                                                    <SelectItem key={r} value={roleMap[r as number]}>{roleMap[r as number]}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {index > 0 && (
                                            <Button variant="destructive" size="icon" onClick={() => handleRemoveRole(index)} className="group bg-blue-50 hover:bg-red-200">
                                                <FaMinus className="text-gray-400 group-hover:text-gray-600" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={handleAddRole} className="mt-2">
                                    <FaPlus className="mr-2 text-green-500" /> Add Role
                                </Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaUser className="text-blue-500" />
                                    Status
                                </Label>
                                <Select value={formData.status} onValueChange={handleStatusChange}>
                                    <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={StatusEnum.Active}>Active</SelectItem>
                                        <SelectItem value={StatusEnum.Inactive}>Inactive</SelectItem>
                                        <SelectItem value={StatusEnum.Pending}>Pending</SelectItem>
                                        <SelectItem value={StatusEnum.Suspended}>Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500" />
                            Address Information
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="street" className="text-blue-900 font-medium flex items-center gap-1">
                                <FaMapMarkerAlt className="text-blue-500" />
                                Street Address
                            </Label>
                            <Input
                                id="street"
                                value={formData.address.street}
                                onChange={(e) => handleAddressChange("street", e.target.value)}
                                className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-green-500" />
                                    City
                                </Label>
                                <Input
                                    id="city"
                                    value={formData.address.city}
                                    onChange={(e) => handleAddressChange("city", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-purple-500" />
                                    State
                                </Label>
                                <Input
                                    id="state"
                                    value={formData.address.state}
                                    onChange={(e) => handleAddressChange("state", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-orange-500" />
                                    Country
                                </Label>
                                <Input
                                    id="country"
                                    value={formData.address.country}
                                    onChange={(e) => handleAddressChange("country", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode" className="text-blue-900 font-medium flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    Zip Code
                                </Label>
                                <Input
                                    id="zipCode"
                                    value={formData.address.zipCode}
                                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="border-blue-300 text-blue-900 hover:bg-blue-50 hover:border-blue-400"
                        >
                            <FaTimes className="mr-2" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                        >
                            <FaSave className="mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}


// perfect user edit modal basic one


