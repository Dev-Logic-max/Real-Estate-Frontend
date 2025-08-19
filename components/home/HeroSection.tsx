"use client"

import { useState, useEffect } from "react"
import HeroSearchBar from "./HeroSearchBar"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentCityIndex, setCurrentCityIndex] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  const animatedWords = [
    { text: "Dream Home", color: "text-blue-500" },
    { text: "Perfect Investment", color: "text-green-500" },
    { text: "Luxury Villa", color: "text-purple-500" },
    { text: "Modern Apartment", color: "text-pink-500" },
    { text: "Commercial Space", color: "text-orange-500" },
  ]

  const cities = [
    { name: "New York", color: "text-blue-500" },
    { name: "Los Angeles", color: "text-purple-500" },
    { name: "Miami", color: "text-pink-500" },
    { name: "Chicago", color: "text-green-500" },
    { name: "San Francisco", color: "text-orange-500" },
  ]

  useEffect(() => {
    const currentWord = animatedWords[currentWordIndex].text

    if (isTyping) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length)
        setIsTyping(true)
      }
    }
  }, [currentText, isTyping, currentWordIndex, animatedWords])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % cities.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [cities.length])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
        }}
      >
        <div className="absolute inset-0 animated-gradient opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 w-[90%] mx-auto">
        <div className="mb-8 animate-fade-in">
          {/* <h1 className="text-5xl md:text-7xl font-bold text-white text-shadow-xl mb-4">
            <span className="gradient-text-blue">Find Your</span>
          </h1> */}
          <h1 className="text-5xl md:text-7xl font-bold text-white text-shadow-xl mb-4">
            <span className="gradient-text-blue">Explore</span> <span className="text-white">Your</span>
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white text-shadow-xl mb-6 min-h-[80px] flex items-center justify-center">
            <span className={`${animatedWords[currentWordIndex].color} transition-colors duration-500`}>
              {currentText}
              <span className="animate-pulse">|</span>
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/90 text-shadow mb-2">
            Discover beautiful properties in{" "}
            <span className={`font-bold transition-all duration-500 ${cities[currentCityIndex].color}`}>
              {cities[currentCityIndex].name}
            </span>
          </p>
          <p className="text-lg text-white/80 text-shadow">
            Get the best real estate deals and explore luxury homes in the most sought-after locations
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mb-12 animate-slide-in">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">20+</div>
            <div className="text-white/80 text-shadow">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">800+</div>
            <div className="text-white/80 text-shadow">Properties Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white text-shadow-lg">1450+</div>
            <div className="text-white/80 text-shadow">Happy Clients</div>
          </div>
        </div>

        {/* Search Bar */}
        <HeroSearchBar />
      </div>
    </section>
  )
}
