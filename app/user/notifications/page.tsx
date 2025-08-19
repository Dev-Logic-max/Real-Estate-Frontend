"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { FaBell, FaHome, FaUser, FaDollarSign, FaCalendar, FaTrash, FaCheck, FaEye } from "react-icons/fa"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Property Match Found!",
      message: "We found a 3-bedroom house in Miami that matches your criteria.",
      type: "property",
      time: "2 minutes ago",
      read: false,
      icon: FaHome,
      color: "blue",
    },
    {
      id: 2,
      title: "Price Drop Alert",
      message: "The property at 123 Ocean Drive has dropped by $50,000.",
      type: "price",
      time: "1 hour ago",
      read: false,
      icon: FaDollarSign,
      color: "green",
    },
    {
      id: 3,
      title: "Tour Scheduled",
      message: "Your property tour is scheduled for tomorrow at 2:00 PM.",
      type: "appointment",
      time: "3 hours ago",
      read: true,
      icon: FaCalendar,
      color: "purple",
    },
    {
      id: 4,
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "account",
      time: "1 day ago",
      read: true,
      icon: FaUser,
      color: "orange",
    },
    {
      id: 5,
      title: "New Message from Agent",
      message: "Sarah Johnson sent you a message about the downtown property.",
      type: "message",
      time: "2 days ago",
      read: false,
      icon: FaUser,
      color: "pink",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200",
      green: "from-green-50 to-green-100 border-green-200",
      purple: "from-purple-50 to-purple-100 border-purple-200",
      orange: "from-orange-50 to-orange-100 border-orange-200",
      pink: "from-pink-50 to-pink-100 border-pink-200",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getIconColor = (color: string) => {
    const colorMap = {
      blue: "text-blue-500",
      green: "text-green-500",
      purple: "text-purple-500",
      orange: "text-orange-500",
      pink: "text-pink-500",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-4 flex items-center justify-center">
              <FaBell className="mr-3 text-yellow-500" />
              Notifications
            </h1>
            <p className="text-xl text-gray-600">Stay updated with your latest activities and alerts</p>
            {unreadCount > 0 && (
              <Badge className="mt-4 bg-red-500 text-white text-lg px-4 py-2">{unreadCount} Unread</Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={markAllAsRead}
              className="gradient-primary text-white hover:opacity-90"
              disabled={unreadCount === 0}
            >
              <FaCheck className="mr-2" />
              Mark All as Read
            </Button>
            <p className="text-gray-600">{notifications.length} total notifications</p>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white shadow-lg rounded-xl p-2">
              <TabsTrigger value="all" className="data-[state=active]:gradient-primary data-[state=active]:text-white">
                All
              </TabsTrigger>
              <TabsTrigger
                value="property"
                className="data-[state=active]:gradient-secondary data-[state=active]:text-white"
              >
                Properties
              </TabsTrigger>
              <TabsTrigger
                value="price"
                className="data-[state=active]:gradient-success data-[state=active]:text-white"
              >
                Price Alerts
              </TabsTrigger>
              <TabsTrigger
                value="appointment"
                className="data-[state=active]:gradient-warning data-[state=active]:text-white"
              >
                Appointments
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="data-[state=active]:gradient-danger data-[state=active]:text-white"
              >
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`shadow-lg hover-lift transition-all duration-300 ${
                      !notification.read ? "ring-2 ring-blue-200" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div
                        className={`flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r ${getColorClasses(notification.color)} border`}
                      >
                        <div className={`p-3 rounded-full bg-white shadow-md ${getIconColor(notification.color)}`}>
                          <notification.icon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={`font-semibold text-lg ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                              >
                                {notification.title}
                                {!notification.read && (
                                  <Badge className="ml-2 bg-red-500 text-white text-xs">New</Badge>
                                )}
                              </h3>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                              <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                            </div>
                            <div className="flex space-x-2">
                              {!notification.read && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:bg-blue-50 rounded-full"
                                >
                                  <FaEye />
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Other tab contents would filter notifications by type */}
            <TabsContent value="property">
              <div className="space-y-4">
                {notifications
                  .filter((n) => n.type === "property")
                  .map((notification) => (
                    <Card key={notification.id} className="shadow-lg hover-lift">
                      <CardContent className="p-6">
                        <div
                          className={`flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r ${getColorClasses(notification.color)} border`}
                        >
                          <div className={`p-3 rounded-full bg-white shadow-md ${getIconColor(notification.color)}`}>
                            <notification.icon className="text-xl" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
