"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { FaBookmark, FaEye, FaHome, FaUser, FaBed, FaBath, FaRulerCombined } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import savedItemsData from "@/json/saved-items.json"

export default function SavedModal() {
  const [savedItems] = useState(savedItemsData)
  const totalSaved = savedItems.properties.length + savedItems.agents.length

  const formatPrice = (price: number, type: string) => {
    if (type === "rent") {
      return `$${price.toLocaleString()}/month`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative bg-green-100 hover:bg-green-200 transition-all duration-300">
          <FaBookmark className="text-green-600 text-lg" />
          {totalSaved > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 text-xs border-2 border-green-300 bg-green-200 hover:bg-green-400 hover:border-green-600">
              {totalSaved}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-gradient-to-br from-white to-green-100">
        <div className="p-4 rounded-t-md group border-b bg-gradient-to-r from-green-200 to-emerald-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg gradient-text-primary">Saved Items</h3>
            {totalSaved > 0 && <Badge className="bg-green-400 group-hover:bg-green-500 text-white">{totalSaved} saved</Badge>}
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {totalSaved > 0 ? (
            <>
              {/* Saved Properties */}
              {savedItems.properties.length > 0 && (
                <div className="p-3 my-1 border-b bg-gradient-to-br from-purple-50 to-green-50">
                  <h4 className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                    <FaHome className="mr-2" />
                    Properties ({savedItems.properties.length})
                  </h4>
                  {savedItems.properties.slice(0, 2).map((property: any) => (
                    <DropdownMenuItem
                      key={property.id}
                      className="p-3 my-1 cursor-pointer hover:bg-gradient-to-r hover:from-purple-200 hover:to-pink-100 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <Image
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          width={60}
                          height={45}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{property.title}</p>
                          <p className="text-xs text-gray-500 mb-1">{property.location}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-600">
                            <span className="flex items-center">
                              <FaBed className="mr-1" />
                              {property.bedrooms}
                            </span>
                            <span className="flex items-center">
                              <FaBath className="mr-1" />
                              {property.bathrooms}
                            </span>
                            <span className="flex items-center">
                              <FaRulerCombined className="mr-1" />
                              {property.area} sq ft
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-green-600 mt-1">
                            {formatPrice(property.price, property.type)}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}

              {/* Saved Agents */}
              {savedItems.agents.length > 0 && (
                <div className="p-3">
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                    <FaUser className="mr-2" />
                    Agents ({savedItems.agents.length})
                  </h4>
                  {savedItems.agents.slice(0, 2).map((agent: any) => (
                    <DropdownMenuItem
                      key={agent.id}
                      className="p-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-100 transition-all duration-300"
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <Image
                          src={agent.image || "/placeholder.svg"}
                          alt={agent.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                          <p className="text-xs text-gray-500">{agent.title}</p>
                          <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                            <span>⭐ {agent.rating}</span>
                            <span>{agent.properties} properties</span>
                            <span>{agent.experience}</span>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaBookmark className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-sm">No saved items yet</p>
              <p className="text-xs text-gray-400 mt-1">Save properties and agents to view them here</p>
            </div>
          )}
        </div>

        <div className="p-2 rounded-b-md border-t bg-gradient-to-r from-green-100 to-emerald-50">
          <Link href="/saved">
            <Button
              variant="ghost"
              className="w-full justify-center hover:bg-gradient-to-r hover:from-blue-200 hover:to-cyan-100 transition-all duration-300 text-gray-600 hover:text-gray-800"
            >
              <FaEye className="mr-2 text-green-500" />
              View All Saved
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
