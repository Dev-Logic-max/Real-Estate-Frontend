"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  FaTachometerAlt,
  FaUsers,
  FaHome,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
  FaChartLine,
  FaHistory,
  FaBell,
} from "react-icons/fa"

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const sidebarItems = [
    { id: "overview", icon: FaTachometerAlt, label: "Dashboard", color: "text-blue-500", route: "/admin" },
    { id: "users", icon: FaUsers, label: "User Management", color: "text-green-500", route: "/admin/users" },
    {
      id: "properties",
      icon: FaHome,
      label: "Property Management",
      color: "text-purple-500",
      route: "/admin/properties",
    },
    { id: "agents", icon: FaUserTie, label: "Agent Management", color: "text-orange-500", route: "/admin/agents" },
    { id: "projects", icon: FaBuilding, label: "Project Management", color: "text-pink-500", route: "/admin/projects" },
    { id: "analytics", icon: FaChartLine, label: "Analytics", color: "text-indigo-500", route: "/admin/analytics" },
    { id: "history", icon: FaHistory, label: "History", color: "text-teal-500", route: "/admin/history" },
    {
      id: "notifications",
      icon: FaBell,
      label: "Notifications",
      color: "text-yellow-500",
      route: "/admin/notifications",
    },
    { id: "settings", icon: FaCog, label: "Settings", color: "text-gray-500", route: "/admin/settings" },
  ]

  const SidebarButton = ({ item }: { item: (typeof sidebarItems)[0] }) => {
    const isActive = pathname === item.route
    const button = (
      <Link href={item.route} className="block">
        <Button
          variant="ghost"
          className={`w-full justify-start transition-all duration-300 ${
            isActive ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500" : "hover:bg-gray-50 text-gray-600"
          } ${!sidebarOpen ? "justify-center" : ""}`}
        >
          <item.icon
            className={`${sidebarOpen ? "mr-3" : ""} ${
              isActive ? item.color : "text-gray-400"
            } transition-colors duration-300`}
          />
          {sidebarOpen && <span>{item.label}</span>}
        </Button>
      </Link>
    )

    if (!sidebarOpen) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" className={`${item.color} bg-white border shadow-lg`}>
              <p className="font-medium">{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } transition-all duration-300 bg-white shadow-lg border-r fixed left-0 top-0 h-full z-40 ${
        !sidebarOpen ? "rounded-r-2xl m-2 h-[calc(100vh-16px)]" : ""
      } overflow-y-auto`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-2">
                <FaTachometerAlt className="text-white text-sm" />
              </div>
              <span className="font-bold gradient-text">Admin Panel</span>
            </div>
          ) : (
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <FaTachometerAlt className="text-white text-sm" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-100 rounded-full"
          >
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </Button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <SidebarButton key={item.id} item={item} />
        ))}

        <div className="pt-4 border-t">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
            >
              <FaSignOutAlt className={`${sidebarOpen ? "mr-3" : ""} text-red-500`} />
              {sidebarOpen && <span>Back to Main</span>}
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
