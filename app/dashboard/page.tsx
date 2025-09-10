"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiHome, FiEye, FiHeart, FiTrendingUp, FiMessageCircle, FiPlus } from "react-icons/fi"
import dashboardData from '../../json/user-dashboard.json'
import StatsCard from "@/components/dashboard/stats-cards"

export default function DashboardPage() {
//   const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    // Load dashboard data
    // import("../data/user-dashboard.json").then((data) => {
    //   setDashboardData(data.default)
    // })
  }, [])

  if (!dashboardData) {
    return <div>Loading...</div>
  }

  const { userStats, recentActivity, userProperties } = dashboardData

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Here's what's happening with your properties today.</p>
        </div>
        {/* <Button className="gradient-primary text-white px-6 py-3 shadow-lg hover-lift">
          <FiPlus className="mr-2" />
          Add Property
        </Button> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Properties"
          value={userStats.totalProperties}
          icon={<FiHome />}
          gradient="gradient-primary"
          change="+2 this month"
          changeType="positive"
        />
        <StatsCard
          title="Active Listings"
          value={userStats.activeListings}
          icon={<FiTrendingUp />}
          gradient="gradient-success"
          change="+1 this week"
          changeType="positive"
        />
        <StatsCard
          title="Total Views"
          value={userStats.totalViews.toLocaleString()}
          icon={<FiEye />}
          gradient="gradient-secondary"
          change="+12% this month"
          changeType="positive"
        />
        <StatsCard
          title="Inquiries"
          value={userStats.inquiries}
          icon={<FiMessageCircle />}
          gradient="gradient-warning"
          change="5 new today"
          changeType="positive"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-purple rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-white" />
              </div>
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity: any) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.title}</p>
                    <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-orange rounded-lg flex items-center justify-center">
                <FiPlus className="text-white" />
              </div>
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start gradient-primary text-white">
              <FiHome className="mr-2" />
              Add New Property
            </Button>
            <Button className="w-full justify-start gradient-secondary text-white">
              <FiMessageCircle className="mr-2" />
              Contact Agent
            </Button>
            <Button className="w-full justify-start gradient-success text-white">
              <FiEye className="mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start gradient-warning text-white">
              <FiHeart className="mr-2" />
              Manage Favorites
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Properties Overview */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-teal rounded-lg flex items-center justify-center">
                <FiHome className="text-white" />
              </div>
              <span>My Properties</span>
            </div>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProperties.map((property: any) => (
              <div
                key={property.id}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {property.status}
                  </span>
                  <span className="text-2xl font-bold gradient-text-primary">${property.price.toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{property.views} views</span>
                  <span>{property.inquiries} inquiries</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
