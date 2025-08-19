"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import AutoImageSlider from "@/components/common/AutoImageSlider"
import { FaBuilding, FaUsers, FaCube, FaCouch, FaStore, FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import projectsData from "@/json/projects.json"

export default function ProjectsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { projects } = projectsData

  const itemsPerSlide = 2
  const totalSlides = Math.ceil(projects.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentProjects = () => {
    const startIndex = currentSlide * itemsPerSlide
    return projects.slice(startIndex, startIndex + itemsPerSlide)
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold mb-2">Best Project of the Year</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Our Services & Projects</h2>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-12 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="projects"
              className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white"
            >
              <FaBuilding className="text-blue-500" />
              Best Projects
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="flex items-center gap-2 data-[state=active]:gradient-secondary data-[state=active]:text-white"
            >
              <FaCube className="text-cyan-500" />
              3D Design
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="flex items-center gap-2 data-[state=active]:gradient-success data-[state=active]:text-white"
            >
              <FaUsers className="text-emerald-500" />
              Agent Finder
            </TabsTrigger>
            <TabsTrigger
              value="furniture"
              className="flex items-center gap-2 data-[state=active]:gradient-warning data-[state=active]:text-white"
            >
              <FaCouch className="text-amber-500" />
              Furniture
            </TabsTrigger>
            <TabsTrigger
              value="commercial"
              className="flex items-center gap-2 data-[state=active]:gradient-teal data-[state=active]:text-white"
            >
              <FaStore className="text-teal-500" />
              Commercial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <div className="relative">
              <Button
                onClick={prevSlide}
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 gradient-primary text-white shadow-lg hover:opacity-90"
              >
                <FaChevronLeft />
              </Button>

              <Button
                onClick={nextSlide}
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 gradient-primary text-white shadow-lg hover:opacity-90"
              >
                <FaChevronRight />
              </Button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-12">
                {getCurrentProjects().map((project: any) => (
                  <Card key={project.id} className="overflow-hidden hover-lift shadow-lg">
                    <AutoImageSlider images={project.images} className="h-80 w-full" objectFit="cover" />
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-2 gradient-text-primary">{project.title}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <p className="text-sm text-gray-500 mb-4">{project.location}</p>
                      <Button className="gradient-primary text-white hover:opacity-90 transition-all duration-300">
                        <FaEye className="mr-2" />
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center space-x-2 mt-8">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide ? "gradient-primary" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="design">
            <div className="text-center py-20">
              <FaCube className="text-6xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4 gradient-text-blue">3D Room & House Design</h3>
              <p className="text-gray-600 mb-8">Visualize your dream home with our advanced 3D design tools</p>
              <Button className="gradient-secondary text-white px-8 py-3">Launch 3D Designer</Button>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="text-center py-20">
              <FaUsers className="text-6xl text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4 gradient-text">Find Expert Agents</h3>
              <p className="text-gray-600 mb-8">Connect with top-rated real estate professionals in your area</p>
              <Button className="gradient-success text-white px-8 py-3">Find Agents</Button>
            </div>
          </TabsContent>

          <TabsContent value="furniture">
            <div className="text-center py-20">
              <FaCouch className="text-6xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4 text-orange-600">Furniture Placement</h3>
              <p className="text-gray-600 mb-8">Design and arrange furniture in your space with our virtual tools</p>
              <Button className="gradient-warning text-white px-8 py-3">Start Designing</Button>
            </div>
          </TabsContent>

          <TabsContent value="commercial">
            <div className="text-center py-20">
              <FaStore className="text-6xl text-pink-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4 text-pink-600">Commercial Features</h3>
              <p className="text-gray-600 mb-8">Explore commercial real estate opportunities and investment options</p>
              <Button className="gradient-purple text-white px-8 py-3">Explore Commercial</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
