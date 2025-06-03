"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import api from "@/lib/api";

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
            AdminAuth.setToken(response.data.token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) =>
                        setCredentials({
                            ...credentials,
                            username: e.target.value,
                        })
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) =>
                        setCredentials({
                            ...credentials,
                            password: e.target.value,
                        })
                    }
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
