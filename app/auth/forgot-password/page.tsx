"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaHome, FaArrowLeft, FaEnvelope } from "react-icons/fa"
import { authApi } from "@/lib/api/auth"
import { toast } from "react-toastify"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await authApi.forgotPassword({ email });
            setIsSubmitted(true); // Show success UI
        } catch (error) {
            // Error is handled by Axios interceptor (toast shown)
            // Optionally, reset email or keep form active
        }
    }

    const handleResend = async () => {
        try {
            await authApi.forgotPassword({ email });
            toast.success("Resent password reset email!");
        } catch (error) {
            // Error handled by interceptor
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 animated-gradient">
            <div className="w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mr-3">
                                <FaHome className="text-white text-xl" />
                            </div>
                            <span className="text-2xl font-bold gradient-text">RealEstate Pro</span>
                        </div>

                        {!isSubmitted ? (
                            <>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                                <p className="text-gray-600">No worries, we'll send you reset instructions.</p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaEnvelope className="text-white text-2xl" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-2">Check your email</h1>
                                <p className="text-gray-600">We sent a password reset link to {email}</p>
                            </>
                        )}
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1 h-12 border-2 border-purple-200 focus:border-purple-500 transition-all duration-300"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 gradient-primary text-white hover:opacity-90 transition-all duration-300 shadow-gradient-pink"
                            >
                                Reset Password
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-600 text-center">
                                Didn't receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                >
                                    try another email address
                                </button>
                            </p>

                            <Button
                                onClick={handleResend}
                                className="w-full h-12 gradient-secondary text-white hover:opacity-90 transition-all duration-300"
                            >
                                Resend Email
                            </Button>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link
                            href="/auth/login"
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
