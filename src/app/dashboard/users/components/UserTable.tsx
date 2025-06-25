import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Eye, Edit, Trash2, BookOpen } from "lucide-react";
import { User } from "@/app/types/admin";
import { updateUserStatus } from "@/lib/api/users";

interface UserTableProps {
    users: User[];
    onUserClick: (user: User) => void;
}

export default function UserTable({ users, onUserClick }: UserTableProps) {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const handleStatusUpdate = async (user: User, newStatus: number) => {
        try {
            await updateUserStatus(user.id!, newStatus);
            window.location.reload(); // Quick fix, or better: update local state
        } catch (error) {
            console.error("Failed to update status:", error);
        }
        setOpenDropdown(null);
    };
    const getStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                        Unsuspended
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                        Unknown
                    </span>
                );
        }
    };

    if (users.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                </h3>
                <p className="text-gray-500">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="">
            {/* Desktop Table */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Books
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => onUserClick(user)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {user.picture ? (
                                                <img
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        user.picture
                                                    }
                                                    alt={user.name || "User"}
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "U"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.name || "Unknown User"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {user.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {user.books_count || 0}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2 cursor-pointer">
                                        <button
                                            onClick={() => {
                                                router.push(
                                                    `/dashboard/users/${user.id}`
                                                );
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4 cursor-pointer" />
                                        </button>
                                        <div className="relative group">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (user.id !== undefined) {
                                                        setOpenDropdown(
                                                            openDropdown ===
                                                                user.id
                                                                ? null
                                                                : user.id
                                                        );
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                            </button>
                                            {openDropdown === user.id && (
                                                <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(
                                                                user,
                                                                user.status ===
                                                                    1
                                                                    ? 0
                                                                    : 1
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        {user.status === 1
                                                            ? "Suspend"
                                                            : "Unsuspend"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
                {users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => onUserClick(user)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    {user.picture ? (
                                        <img
                                            className="h-12 w-12 rounded-full object-cover"
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_IMAGE_PATH +
                                                user.picture
                                            }
                                            alt={user.name || "User"}
                                        />
                                    ) : (
                                        <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-lg font-medium text-gray-700">
                                                {user.name
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">
                                        {user.name || "Unknown User"}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        {user.email}
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <BookOpen className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-xs text-gray-500">
                                            {user.books_count || 0} books
                                        </span>
                                        <span className="mx-2">·</span>
                                        {getStatusBadge(user.status)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(
                                            `/dashboard/users/${user.id}`
                                        );
                                    }}
                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                >
                                    <Eye className="w-4 h-4 cursor-pointer" />
                                </button>
                                <div className="relative ">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (user.id !== undefined) {
                                                setOpenDropdown(
                                                    openDropdown === user.id
                                                        ? null
                                                        : user.id
                                                );
                                            }
                                        }}
                                        className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                    </button>
                                    {/* THIS WAS MISSING - Added the dropdown menu for mobile */}
                                    {openDropdown === user.id && (
                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10 ">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusUpdate(
                                                        user,
                                                        user.status === 1
                                                            ? 0
                                                            : 1
                                                    );
                                                }}
                                                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                                            >
                                                {user.status === 1
                                                    ? "Suspend"
                                                    : "Unsuspend"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
