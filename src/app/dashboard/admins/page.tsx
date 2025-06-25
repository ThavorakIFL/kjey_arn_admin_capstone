"use client";

import { Admin } from "@/app/types/admin";
import {
    fetchTotalAdmin,
    createAdmin as createAdminApi,
} from "@/lib/api/admin";
import { AdminAuth } from "@/lib/auth";
import { MapPin, Plus, Save, UserCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false); // Separate state for create operation
    const isSuperAdmin = AdminAuth.getIsSuperAdmin()?.toString() || "0";

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetchTotalAdmin();
            if (response.success) {
                setAdmins(response.data);
            } else {
                console.error("API Error:", response.message);
                setAdmins([]);
            }
        } catch (error) {
            console.error("Error fetching admins:", error);
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    };

    const onClose = () => {
        setShowModal(false);
        setUsername("");
        setPassword("");
        setError("");
    };

    if (isSuperAdmin !== "1") {
        return (
            <div className="bg-black h-screen">
                <h1 className="text-3xl font-bold text-red-300">
                    You are not authorized to access this page.
                </h1>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setError("");

        // Validation
        if (!username.trim() || !password.trim()) {
            setError("Username and password are required");
            return;
        }
        if (username.trim().length < 2) {
            setError("Username must be at least 2 characters long");
            return;
        }
        if (password.trim().length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setCreating(true);

        try {
            const response = await createAdminApi({
                username: username.trim(),
                password: password.trim(),
            });

            if (response.success) {
                setShowModal(false);
                setUsername("");
                setPassword("");
                setError("");
                await fetchAdmins(); // Refresh the admin list
            } else {
                setError(response.message || "Failed to create admin");
            }
        } catch (err: any) {
            console.error("Error creating admin:", err);
            setError(err.message || "Failed to create admin");
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const getAdminRole = (admin: number): string => {
        return admin === 1 ? "Super Admin" : "Admin";
    };

    return (
        <>
            <div className="p-8 w-full">
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                    <div className="mb-4 flex justify-end w-full">
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Admin
                        </button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 border">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    USERNAME
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IS SUPER ADMIN
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 border">
                            {admins.map((admin) => (
                                <tr
                                    key={admin.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {admin.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {admin.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getAdminRole(admin.super_admin)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <UserCheck className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Add New Admin
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                disabled={creating}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label
                                        htmlFor="admin-username"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="admin-username"
                                        type="text"
                                        value={username}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        placeholder="Enter admin username"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={creating}
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="admin-password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="admin-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter admin password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={creating}
                                    />
                                </div>

                                {error && (
                                    <div className="mb-4">
                                        <p className="text-sm text-red-600">
                                            {error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={creating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={
                                        creating ||
                                        !username.trim() ||
                                        !password.trim()
                                    }
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {creating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Create Admin
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
