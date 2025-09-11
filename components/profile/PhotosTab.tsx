"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Upload, Trash2, Star, ImageIcon } from "lucide-react"
import Image from "next/image"

interface PhotosTabProps {
  profilePhotos: string[]
  currentAvatar: string
  userName: string
  onPhotoUpload?: (file: File) => void
  onPhotoDelete?: (index: number) => void
  onSetAvatar?: (photoUrl: string) => void
}

export default function PhotosTab({
  profilePhotos,
  currentAvatar,
  userName,
  onPhotoUpload,
  onPhotoDelete,
  onSetAvatar,
}: PhotosTabProps) {
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onPhotoUpload) {
      onPhotoUpload(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && onPhotoUpload) {
      onPhotoUpload(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Profile Photo */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Camera className="h-5 w-5 text-blue-500" />
            Current Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
              <AvatarImage src={currentAvatar || "/placeholder.svg"} alt={userName} />
              <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{userName}</h3>
              <p className="text-gray-600 text-sm">This is your current profile photo</p>
              <Button
                size="sm"
                className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload New Photo */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Upload className="h-5 w-5 text-green-500" />
            Upload New Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Drop your photo here, or click to browse</h3>
            <p className="text-gray-600 mb-4">Supports JPG, PNG, GIF up to 10MB</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="photo-upload" />
            <Button
              asChild
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <label htmlFor="photo-upload" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Gallery */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Photo Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {profilePhotos.map((photo, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Profile photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onSetAvatar?.(photo)}
                      className="bg-white hover:bg-gray-100"
                    >
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onPhotoDelete?.(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Current avatar indicator */}
                {photo === currentAvatar && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Current
                  </div>
                )}
              </div>
            ))}
          </div>

          {profilePhotos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No photos uploaded yet</p>
              <p className="text-sm">Upload your first photo to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
