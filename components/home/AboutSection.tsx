"use client"

import { Button } from "@/components/ui/button"

export default function AboutSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            <span className="gradient-text">We are a global, boutique</span>{" "}
                            <span className="text-gray-800">real estate brokerage</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-8">The forefront of real estate</p>
                        <p className="text-gray-600 mb-8">
                            Lorem ipsum dolor sit amet consectetur. Feugiat et risus ut consectetur lorem lorem ipsum dolor sit
                            amet consectetur. Adipiscing consequat lorem lorem ipsum dolor sit amet consectetur.
                        </p>
                        <div className="flex gap-8 mb-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text-primary">12+</div>
                                <div className="text-gray-600">Years Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text-blue">14+</div>
                                <div className="text-gray-600">Award Winning</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold gradient-text">10+</div>
                                <div className="text-gray-600">Property Ready</div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button className="gradient-primary text-white px-6 py-3">Book Now</Button>
                            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
                                Read More
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="/placeholder.svg?height=500&width=600"
                            alt="Real estate overview"
                            className="rounded-2xl shadow-2xl w-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
