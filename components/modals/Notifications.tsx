"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FaBell, FaEye } from "react-icons/fa"
import { MdNotifications } from "react-icons/md";
import Link from "next/link"
import notificationsData from "@/json/notifications.json"

export default function NotificationsModal() {
  const [notifications, setNotifications] = useState(notificationsData)
  const unreadCount = notifications.filter((n) => !n.read).length

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "info":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getHoverColor = (type: string) => {
    switch (type) {
      case "success":
        return "hover:bg-gradient-to-r hover:from-green-200 hover:to-emerald-100"
      case "warning":
        return "hover:bg-gradient-to-r hover:from-orange-200 hover:to-amber-100"
      case "info":
        return "hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-100"
      default:
        return "hover:bg-gradient-to-r hover:from-gray-200 hover:to-slate-100"
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-yellow-50 hover:bg-yellow-200 transition-all duration-300">
          <FaBell className="text-yellow-600 text-lg" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 text-xs border-2 border-red-300 bg-red-200 hover:bg-red-400 hover:border-red-600">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-gradient-to-br from-white to-blue-50">
        <div className="p-4 rounded-t-md group border-b bg-gradient-to-r from-purple-200 to-orange-100">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-semibold text-lg gradient-text-primary"><MdNotifications className="w-6 h-6 text-amber-500"/>Notifications</h3>
            {unreadCount > 0 && <Badge className="bg-red-400 group-hover:bg-red-500 transition-all text-white">{unreadCount} new</Badge>}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.slice(0, 5).map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 my-1 cursor-pointer transition-all duration-300 ${getHoverColor(notification.type)} ${
                  !notification.read ? "bg-blue-200/20" : ""
                }`}
              >
                <div className="flex items-start space-x-3 w-full">
                  <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getTypeColor(notification.type)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatTime(notification.timestamp)}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2 mt-1" />
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaBell className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>

        <div className="p-2 rounded-b-md border-t bg-gradient-to-r from-purple-100 to-orange-50">
          <Link href="/notifications">
            <Button
              variant="ghost"
              className="w-full justify-center hover:bg-gradient-to-r hover:from-blue-200 hover:to-purple-100 transition-all duration-300 text-gray-600 hover:text-gray-800"
            >
              <FaEye className="mr-2 text-blue-500" />
              View All Notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
