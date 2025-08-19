"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FaHome, FaUser, FaBell, FaSignOutAlt, FaEyeSlash, FaEye, FaCog } from "react-icons/fa"

interface DashboardHeaderProps {
  isHeaderVisible: boolean
  toggleHeader: () => void
}

export default function AdminHeader({ isHeaderVisible, toggleHeader }: DashboardHeaderProps) {
  const [notifications] = useState([
    { id: 1, title: "New user registered", type: "success" },
    { id: 2, title: "Property listing pending approval", type: "warning" },
    { id: 3, title: "System maintenance scheduled", type: "info" },
  ])

  if (!isHeaderVisible) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleHeader}
          size="icon"
          className="gradient-primary text-white shadow-lg hover:opacity-90 rounded-full"
        >
          <FaEye />
        </Button>
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <FaHome className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">RealEstate Pro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/">
              <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                <FaHome className="mr-2 text-blue-500" />
                Main Site
              </Button>
            </Link>
          </nav>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3">
          {/* Hide Header Button */}
          <Button onClick={toggleHeader} variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
            <FaEyeSlash className="text-gray-600" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-yellow-50 transition-all duration-300 rounded-full"
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
                <h3 className="font-semibold gradient-text">Admin Notifications</h3>
              </div>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
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

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 transition-all duration-300 rounded-full">
                <FaUser className="text-blue-600 text-lg" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
                <Link href="/users/profile" className="flex items-center w-full">
                  <FaUser className="mr-2 text-blue-500" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-green-50 hover:to-teal-50">
                <Link href="/settings" className="flex items-center w-full">
                  <FaCog className="mr-2 text-green-500" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 text-red-600">
                <button className="flex items-center w-full">
                  <FaSignOutAlt className="mr-2 text-red-500" />
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
