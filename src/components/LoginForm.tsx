import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useState } from "react";
import { AdminAuth } from "@/lib/auth";
import { Button } from "./ui/button";

export default function LoginForm() {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const router = useRouter();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post("/admin/login", credentials);
            AdminAuth.setToken(response.data.token);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please check your credentials.");
        }
    };
    return (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label htmlFor="username">Username</label>
            <input
                name="username"
                id="username"
                placeholder="Enter Admin Username"
                value={credentials.username}
                onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                }
                type="text"
            />
            <label htmlFor="password">Password</label>
            <input
                name="password"
                id="password"
                placeholder="Enter Admin Password"
                value={credentials.password}
                onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                }
                type="password"
            />
            <Button type="submit">Login</Button>
        </form>
    );
}
