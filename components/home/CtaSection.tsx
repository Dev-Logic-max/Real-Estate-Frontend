"use client"

import { Button } from "@/components/ui/button"

export default function CtaSection() {
    return (
        <>
            <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="gradient-secondary rounded-2xl p-8 text-white">
                            <h3 className="text-3xl font-bold mb-4">Manage Your Property</h3>
                            <p className="mb-6">
                                Your will have everything nearby supermarket, buses, station, the carmen neighborhood, etc
                            </p>
                            <Button className="bg-white text-blue-600 hover:bg-gray-100">Get A Quote</Button>
                        </div>
                        <div className="gradient-warning rounded-2xl p-8 text-white">
                            <h3 className="text-3xl font-bold mb-4">Virtual Home Design</h3>
                            <p className="mb-6">Design your dream home with our advanced virtual reality tools</p>
                            <Button className="bg-white text-orange-600 hover:bg-gray-100">Start Designing</Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-lg mb-2">Three easy. Three minutes.</p>
                    <h2 className="text-4xl md:text-5xl font-bold mb-12">Everything should be this easy.</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Answer questions</h3>
                            <p className="text-gray-300">
                                Lorem ipsum dolor sit amet consectetur. Adipiscing consequat lorem lorem ipsum dolor sit amet
                                consectetur.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Select a quote</h3>
                            <p className="text-gray-300">
                                Lorem ipsum dolor sit amet consectetur. Adipiscing consequat lorem lorem ipsum dolor sit amet
                                consectetur.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Get registered</h3>
                            <p className="text-gray-300">
                                Lorem ipsum dolor sit amet consectetur. Adipiscing consequat lorem lorem ipsum dolor sit amet
                                consectetur.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
