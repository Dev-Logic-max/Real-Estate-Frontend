"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Newsletter section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4 gradient-text-primary">Stay Updated</h3>
            <p className="text-gray-300 mb-6">
              Get the latest property listings and real estate news delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mr-3">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold gradient-text-primary">RealEstate</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted partner in finding the perfect property. We connect dreams with reality through exceptional
              real estate services.
            </p>
            <div className="flex space-x-4">
              <Button size="icon" variant="ghost" className="text-blue-400 hover:bg-blue-500/20">
                <FaFacebookF />
              </Button>
              <Button size="icon" variant="ghost" className="text-cyan-400 hover:bg-cyan-500/20">
                <FaTwitter />
              </Button>
              <Button size="icon" variant="ghost" className="text-pink-400 hover:bg-pink-500/20">
                <FaInstagram />
              </Button>
              <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-600/20">
                <FaLinkedinIn />
              </Button>
              <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/20">
                <FaYoutube />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-blue-400">Quick Links</h4>
            <ul className="space-y-3">
              {["Properties", "Agents", "Projects", "About Us", "Contact", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-emerald-400">Services</h4>
            <ul className="space-y-3">
              {[
                "Buy Property",
                "Sell Property",
                "Rent Property",
                "Property Management",
                "Real Estate Consulting",
                "Investment Advisory",
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6 text-amber-400">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-400 mr-3" />
                <span className="text-gray-300">123 Real Estate St, Miami, FL 33101</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-green-400 mr-3" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-blue-400 mr-3" />
                <span className="text-gray-300">info@realestate.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 RealEstate Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
