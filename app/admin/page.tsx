import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUsers, FaHome, FaDollarSign, FaChartLine, FaArrowUp, FaArrowDown } from "react-icons/fa"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: FaUsers,
      gradient: "gradient-primary",
    },
    {
      title: "Properties",
      value: "856",
      change: "+8%",
      trend: "up",
      icon: FaHome,
      gradient: "gradient-secondary",
    },
    {
      title: "Revenue",
      value: "$2.4M",
      change: "+15%",
      trend: "up",
      icon: FaDollarSign,
      gradient: "gradient-success",
    },
    {
      title: "Growth",
      value: "+12%",
      change: "-2%",
      trend: "down",
      icon: FaChartLine,
      gradient: "gradient-warning",
    },
  ]

  const recentActivities = [
    { id: 1, action: "New user registered", user: "John Doe", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Property listed", user: "Sarah Johnson", time: "5 minutes ago", type: "property" },
    { id: 3, action: "Payment received", user: "Mike Wilson", time: "10 minutes ago", type: "payment" },
    { id: 4, action: "Agent approved", user: "Emma Davis", time: "15 minutes ago", type: "agent" },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className={`hover-lift ${stat.gradient} text-white overflow-hidden relative`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <FaArrowUp className="text-white/80 mr-1" />
                    ) : (
                      <FaArrowDown className="text-white/80 mr-1" />
                    )}
                    <span className="text-white/80 text-sm">{stat.change}</span>
                  </div>
                </div>
                <stat.icon className="text-4xl text-white/60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="gradient-text">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === "user"
                        ? "bg-green-500"
                        : activity.type === "property"
                          ? "bg-blue-500"
                          : activity.type === "payment"
                            ? "bg-yellow-500"
                            : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="gradient-text-blue">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-lg gradient-primary text-white hover:opacity-90 transition-all duration-300 text-center">
                <FaUsers className="mx-auto mb-2 text-2xl" />
                <span className="text-sm">Add User</span>
              </button>
              <button className="p-4 rounded-lg gradient-secondary text-white hover:opacity-90 transition-all duration-300 text-center">
                <FaHome className="mx-auto mb-2 text-2xl" />
                <span className="text-sm">Add Property</span>
              </button>
              <button className="p-4 rounded-lg gradient-success text-white hover:opacity-90 transition-all duration-300 text-center">
                <FaChartLine className="mx-auto mb-2 text-2xl" />
                <span className="text-sm">View Reports</span>
              </button>
              <button className="p-4 rounded-lg gradient-warning text-white hover:opacity-90 transition-all duration-300 text-center">
                <FaDollarSign className="mx-auto mb-2 text-2xl" />
                <span className="text-sm">Payments</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
