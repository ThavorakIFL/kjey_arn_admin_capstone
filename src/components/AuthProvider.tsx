"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import api from "@/lib/api";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    admin: any | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            const token = AdminAuth.getToken();
            if (!token) {
                if (pathname !== "/login") {
                    router.push("/login");
                }
                setIsLoading(false);
                return;
            }
            try {
                const response = await api.get("/admin/check");
                setAdmin(response.data);
                setIsAuthenticated(true);
                if (pathname === "/login" || pathname === "/") {
                    router.push("/dashboard");
                }
            } catch (error) {
                AdminAuth.removeToken();
                setIsAuthenticated(false);
                setAdmin(null);
                if (pathname !== "/login") {
                    router.push("/login");
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [router, pathname]);

    const logout = () => {
        AdminAuth.removeToken();
        setIsAuthenticated(false);
        setAdmin(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isLoading, admin, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
