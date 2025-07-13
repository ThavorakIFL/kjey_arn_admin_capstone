import React, { useState } from "react";
import {
    Mail,
    User,
    MoreHorizontal,
    Edit,
    Ban,
    CheckCircle,
} from "lucide-react";

interface User {
    id?: number;
    name?: string;
    email?: string;
    picture?: string;
    bio?: string;
    status?: number;
    created_at?: string;
}

interface UserProfileCardProps {
    user: User;
    onStatusUpdate: (newStatus: number) => void;
}

export default function UserProfileCard({
    user,
    onStatusUpdate,
}: UserProfileCardProps) {
    const [openDropdown, setOpenDropdown] = useState(false);

    const getStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Unsuspended
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <Ban className="w-4 h-4 mr-1" />
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Unknown
                    </span>
                );
        }
    };

    const handleStatusToggle = () => {
        const newStatus = user.status === 1 ? 0 : 1;
        onStatusUpdate(newStatus);
        setOpenDropdown(false);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    User Profile
                </h2>
                <div className="relative">
                    <button
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50"
                    >
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {openDropdown && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                            <button
                                onClick={handleStatusToggle}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                            >
                                {user.status === 1 ? (
                                    <>
                                        <Ban className="w-4 h-4 mr-2 text-red-500" />
                                        Suspend User
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                        Unsuspend User
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Image */}
            <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 mb-4">
                    {user.picture ? (
                        <img
                            src={
                                process.env.NEXT_PUBLIC_IMAGE_PATH +
                                user.picture
                            }
                            alt={user.name || "User"}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                            <User className="w-12 h-12 text-gray-600" />
                        </div>
                    )}
                </div>

                {/* Status Badge */}
                <div className="mb-4">{getStatusBadge(user.status)}</div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Name
                    </label>
                    <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50">
                        <span className="text-gray-900">
                            {user.name || "N/A"}
                        </span>
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Gmail
                    </label>
                    <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                            {user.email || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
