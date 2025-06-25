import React from "react";
import { User, Mail, CheckCircle, XCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
interface User {
    id?: number;
    name?: string;
    email?: string;
    picture?: string;
    status?: number;
}

interface BookAvailability {
    id: number;
    availability_id: number;
    availability?: {
        id: number;
        availability: string;
    };
}

interface BookOwnerCardProps {
    user?: User;
    availability?: BookAvailability;
}

export default function BookOwnerCard({
    user,
    availability,
}: BookOwnerCardProps) {
    const router = useRouter();
    const getAvailabilityBadge = (availability?: BookAvailability) => {
        const availabilityId = availability?.availability_id;
        switch (availabilityId) {
            case 1:
                return (
                    <div className="flex items-center justify-center w-full p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                            <p className="text-lg font-semibold text-green-800">
                                Available
                            </p>
                            <p className="text-sm text-green-600">
                                This book is available for borrowing
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="flex items-center justify-center w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                            <p className="text-lg font-semibold text-red-800">
                                Unavailable
                            </p>
                            <p className="text-sm text-red-600">
                                This book is currently being borrowed
                            </p>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center w-full p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <XCircle className="w-8 h-8 text-gray-600 mr-3" />
                        <div>
                            <p className="text-lg font-semibold text-gray-800">
                                Unknown
                            </p>
                            <p className="text-sm text-gray-600">
                                Availability status unknown
                            </p>
                        </div>
                    </div>
                );
        }
    };

    const getUserStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        Unsuspended
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1"></div>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></div>
                        Unknown
                    </span>
                );
        }
    };

    const handleViewOwnerProfile = () => {
        router.push(`/dashboard/users/${user?.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Availability Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Availability
                </h3>
                {getAvailabilityBadge(availability)}
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Owner
                    </h3>
                    {user && (
                        <button
                            onClick={handleViewOwnerProfile}
                            className="cursor-pointer inline-flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            View Profile
                        </button>
                    )}
                </div>

                {user ? (
                    <div>
                        {/* Owner Profile */}
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                {user.picture ? (
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            user.picture
                                        }
                                        alt={user.name || "Owner"}
                                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                                        <User className="w-8 h-8 text-gray-600" />
                                    </div>
                                )}
                            </div>
                            <div className="ml-4 flex-1">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {user.name || "Unknown User"}
                                    </h4>
                                    {getUserStatusBadge(user.status)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    Book Owner
                                </p>
                            </div>
                        </div>

                        {/* Owner Details */}
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Email
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {user.email || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <User className="w-4 h-4 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        User ID
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        #{user.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                            Owner information not available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
