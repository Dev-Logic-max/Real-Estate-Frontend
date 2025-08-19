"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FaTachometerAlt,
  FaUsers,
  FaHome,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBuilding,
  FaChartLine,
  FaHistory,
  FaBell,
} from "react-icons/fa"

interface DashboardSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const sidebarItems = [
    { id: "overview", icon: FaTachometerAlt, label: "Dashboard", color: "text-blue-500" },
    { id: "users", icon: FaUsers, label: "User Management", color: "text-green-500" },
    { id: "properties", icon: FaHome, label: "Property Management", color: "text-purple-500" },
    { id: "agents", icon: FaUserTie, label: "Agent Management", color: "text-orange-500" },
    { id: "projects", icon: FaBuilding, label: "Project Management", color: "text-pink-500" },
    { id: "analytics", icon: FaChartLine, label: "Analytics", color: "text-indigo-500" },
    { id: "history", icon: FaHistory, label: "History", color: "text-teal-500" },
    { id: "notifications", icon: FaBell, label: "Notifications", color: "text-yellow-500" },
    { id: "settings", icon: FaCog, label: "Settings", color: "text-gray-500" },
  ]

  return (
    <div className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-white shadow-lg border-r`}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center mr-2">
                <FaTachometerAlt className="text-white text-sm" />
              </div>
              <span className="font-bold gradient-text">Admin Panel</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-gray-100 rounded-full"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </Button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            onClick={() => onTabChange(item.id)}
            className={`w-full justify-start transition-all duration-300 ${
              activeTab === item.id
                ? "gradient-primary text-white shadow-gradient-blue"
                : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
            }`}
          >
            <item.icon
              className={`${sidebarOpen ? "mr-3" : ""} ${activeTab === item.id ? "text-white" : item.color}`}
            />
            {sidebarOpen && <span>{item.label}</span>}
          </Button>
        ))}

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
          >
            <FaSignOutAlt className={`${sidebarOpen ? "mr-3" : ""} text-red-500`} />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </nav>
    </div>
  )
}
