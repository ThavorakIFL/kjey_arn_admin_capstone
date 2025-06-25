"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import api from "@/lib/api/api";

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/admin/login", credentials);
            console.log("Login successful:", response.data.admin.super_admin);
            AdminAuth.setIsSuperAdmin(
                response.data.admin.super_admin.toString()
            );
            AdminAuth.setToken(response.data.token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Title */}
            <div className="mb-16">
                <h1 className="text-4xl font-bold text-gray-900 text-center">
                    Kjey Arn
                </h1>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-sm">
                <div className="bg-white py-8 px-8 shadow-sm rounded-lg">
                    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
                        Login
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={credentials.username}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        username: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={credentials.password}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <a
                                href="#"
                                className="text-sm text-gray-600 hover:text-gray-900"
                            >
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
