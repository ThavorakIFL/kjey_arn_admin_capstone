// components/Navbar.tsx
"use client";

import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const { admin, logout } = useAuth();

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1>Admin Panel</h1>
                <div className="flex items-center space-x-4">
                    <span>Hello, {admin?.username}</span>
                    <button
                        onClick={logout}
                        className="bg-red-600 px-3 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
