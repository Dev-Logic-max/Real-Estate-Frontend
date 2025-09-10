"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FiHome, FiSettings, FiBell, FiClock, FiHeart, FiBarChart2, FiUsers, FiChevronLeft, FiChevronRight, FiLogOut } from "react-icons/fi"
import { FaBuilding } from "react-icons/fa"
import { MdDashboard } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: FiBarChart2,
    color: "text-blue-600",
  },
  {
    title: "My Properties",
    href: "/dashboard/properties",
    icon: FiHome,
    color: "text-green-600",
  },
  {
    title: "My Agents",
    href: "/dashboard/agents",
    icon: FiUsers,
    color: "text-purple-600",
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FaBuilding,
    color: "text-orange-600",
  },
  {
    title: "Favorites",
    href: "/dashboard/favorites",
    icon: FiHeart,
    color: "text-pink-600",
  },
  {
    title: "History",
    href: "/dashboard/history",
    icon: FiClock,
    color: "text-indigo-600",
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: FiBell,
    color: "text-red-600",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: FiSettings,
    color: "text-gray-600",
  },
]

export default function UserSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const SidebarButton = ({ item }: { item: (typeof sidebarItems)[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    const button = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
          isActive
            ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
        )}
      >
        <Icon className={cn("text-xl", isActive ? "text-blue-600" : item.color)} />
        {!isCollapsed && <span className="font-medium">{item.title}</span>}
      </Link>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right" className={`${item.color} bg-white border shadow-lg`}>
              <p className="font-medium">{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  return (
    <div
      className={cn(
        "fixed h-full bg-white border-gray-200 transition-all duration-300 z-50 shadow-lg",
        isCollapsed ? "w-20 rounded-2xl m-2 border h-[calc(100vh-16px)]" : "w-64 border-r",
      )}
    >
      {/* Header */}
      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-gray-200`}>
        <div className="flex items-center justify-between relative">
          {isCollapsed ? (
            <div className="flex items-center">
              <div className="w-9 h-9 gradient-primary rounded-lg flex items-center justify-center mx-auto">
                <RxDashboard className="text-white text-base" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <MdDashboard className="text-white text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Dashboard</h2>
                <p className="text-sm text-gray-500">Welcome back!</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "bg-gray-50 hover:bg-gray-100 rounded-full text-blue-500 z-40 absolute",
              isCollapsed ? "border scale-90 -right-8" : "hover:border top-50% right-0"
            )}
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={cn("p-4 space-y-2", isCollapsed ? "overflow-hidden" : "")}>
        {sidebarItems.map((item) => (
          <SidebarButton key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <FiLogOut className={cn("text-lg", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}