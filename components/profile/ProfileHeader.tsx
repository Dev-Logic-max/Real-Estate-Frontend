"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, MapPin, Calendar, Phone, Mail } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  status: string
  avatar: string
  joinDate: string
  address: {
    street: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  stats: {
    propertiesViewed: number
    savedProperties: number
    inquiriesSent: number
    toursScheduled: number
  }
}

interface ProfileHeaderProps {
  user: User
  onAvatarChange?: () => void
}

export default function ProfileHeader({ user, onAvatarChange }: ProfileHeaderProps) {
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "buyer":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
      case "seller":
        return "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg"
      case "user":
        return "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
      case "inactive":
        return "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-600 text-white shadow-lg"
    }
  }

  return (
    <Card className="bg-gradient-to-br from-white/90 via-blue-50/50 to-purple-50/50 backdrop-blur-sm border-0 shadow-2xl ring-1 ring-white/20">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative group">
              <Avatar className="h-32 w-32 ring-4 ring-white/80 shadow-2xl transition-all duration-300 group-hover:ring-blue-200">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                onClick={onAvatarChange}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-4">
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              <Badge className={getStatusBadgeColor(user.status)}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span>{user.phone}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>
                    {user.address.city}, {user.address.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold">{user.stats.propertiesViewed}</div>
                <div className="text-sm opacity-90">Properties Viewed</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold">{user.stats.savedProperties}</div>
                <div className="text-sm opacity-90">Saved Properties</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-700 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold">{user.stats.inquiriesSent}</div>
                <div className="text-sm opacity-90">Inquiries Sent</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-2xl font-bold">{user.stats.toursScheduled}</div>
                <div className="text-sm opacity-90">Tours Scheduled</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
