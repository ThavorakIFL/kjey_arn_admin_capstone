import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kjey Arn - Admin",
    icons: {
        icon: "/kjeyarn-logo.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AuthProvider>
                    <Toaster
                        position="bottom-right"
                        expand={true}
                        richColors
                        toastOptions={{
                            style: {
                                background: "white",
                                border: "1px solid #e2e8f0",
                                color: "black",
                            },
                        }}
                    />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
