'use client'

import { ToastContainer } from "react-toastify";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function LandingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const pathname = usePathname();
    return (
        <AuthProvider>
            {!pathname?.startsWith("/admin") && !pathname?.startsWith("/auth") && <Header />}
            <main>
                {children}
                <ToastContainer />
            </main>
            {!pathname?.startsWith("/admin") && !pathname?.startsWith("/auth") && !pathname?.startsWith("/properties") && <Footer />}
        </AuthProvider>
    );
}