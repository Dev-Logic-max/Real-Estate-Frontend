"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    FaUser,
    FaBell,
    FaHome,
    FaSellsy,
    FaUsers,
    FaTools,
    FaBuilding,
    FaTachometerAlt,
    FaSignInAlt,
} from "react-icons/fa"
import NotificationsModal from "../modals/Notifications"
import SavedModal from "../modals/Saved"
import { useAuth } from "@/hooks/useAuth"

export default function Header() {
    const [activeTab, setActiveTab] = useState("")
    const { user, logout } = useAuth()

    const navItems = [
        {
            id: "properties",
            label: "Properties",
            icon: FaHome,
            href: "/properties",
            color: "text-purple-600",
            hoverColor: "hover:bg-purple-50 hover:text-purple-700",
        },
        {
            id: "sell-rent",
            label: "Sell/Rent",
            icon: FaSellsy,
            href: "/sell-rent",
            color: "text-green-600",
            hoverColor: "hover:bg-green-50 hover:text-green-700",
        },
        {
            id: "agents",
            label: "Agents",
            icon: FaUsers,
            href: "/agents",
            color: "text-blue-600",
            hoverColor: "hover:bg-blue-50 hover:text-blue-700",
        },
        {
            id: "tools",
            label: "User Tools",
            icon: FaTools,
            href: "/tools",
            color: "text-orange-600",
            hoverColor: "hover:bg-orange-50 hover:text-orange-700",
        },
        {
            id: "projects",
            label: "Projects",
            icon: FaBuilding,
            href: "/projects",
            color: "text-pink-600",
            hoverColor: "hover:bg-pink-50 hover:text-pink-700",
        },
        {
            id: "dashboard",
            label: "Dashboard",
            icon: FaTachometerAlt,
            href: "/admin/dashboard",
            color: "text-indigo-600",
            hoverColor: "hover:bg-indigo-50 hover:text-indigo-700",
        },
    ]

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

                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link key={item.id} href={item.href}>
                                <Button
                                    variant="ghost"
                                    onClick={() => setActiveTab(item.id)}
                                    className={`transition-all duration-300 ${activeTab === item.id
                                            ? `${item.color} bg-gradient-to-r from-blue-50 to-purple-50`
                                            : `text-gray-600 ${item.hoverColor}`
                                        }`}
                                >
                                    <item.icon
                                        className={`mr-2 ${activeTab === item.id ? item.color.replace("text-", "text-") : "text-gray-400"}`}
                                    />
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        {/* Notifications */}
                        <NotificationsModal />

                        {/* Saved Items */}
                        <SavedModal />

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="bg-blue-100 hover:bg-blue-200 transition-all duration-300">
                                        <FaUser className="text-blue-600 text-lg" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white">
                                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-100">
                                        <Link href="/profile" className="flex items-center w-full">
                                            <FaUser className="mr-2 text-blue-500" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-yellow-200 hover:to-orange-100">
                                        <Link href="/notifications" className="flex items-center w-full">
                                            <FaBell className="mr-2 text-yellow-500" />
                                            Notifications
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-green-200 hover:to-teal-100">
                                        <Link href="/settings" className="flex items-center w-full">
                                            <FaTools className="mr-2 text-green-500" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-red-200 hover:to-pink-100 text-red-600">
                                        <button onClick={logout} className="flex items-center w-full">
                                            <FaSignInAlt className="mr-2 text-red-500" />
                                            Logout
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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

