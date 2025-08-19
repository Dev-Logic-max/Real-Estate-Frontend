"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface AutoImageSliderProps {
  images: { src: string; alt?: string }[]
  interval?: number // in milliseconds, default to 4000
  width?: number
  height?: number
  className?: string
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down"
}

export default function AutoImageSlider({
  images,
  interval = 4000,
  width,
  height,
  className,
  objectFit = "cover",
}: AutoImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images, interval])

  if (!images || images.length === 0) {
    return <div className={`flex items-center justify-center border bg-gray-100 h-full text-gray-400`} style={{ width: width, height: height }}>No images to display.</div>
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width: width, height: height }}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src || ''}
          alt={image.alt || ''}
          fill
          className={`absolute transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectFit: objectFit }}
          priority={index === 0} // Prioritize loading the first image
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
