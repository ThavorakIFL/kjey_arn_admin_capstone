import React from "react";
import { User, Mail, Eye, Crown, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
interface User {
    id?: number;
    name?: string;
    email?: string;
    picture?: string;
    status?: number;
}

interface BorrowActivityParticipantsProps {
    borrower?: User;
    lender?: User;
}

export default function BorrowActivityParticipants({
    borrower,
    lender,
}: BorrowActivityParticipantsProps) {
    const router = useRouter();
    const getUserStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                        Active
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

    const handleViewProfile = (user: User) => {
        router.push(`/dashboard/users/${user.id}`);
    };

    const renderUserCard = (
        user: User | undefined,
        role: "lender" | "borrower"
    ) => {
        if (!user) {
            return (
                <div className="text-center py-6">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                        {role} information not available
                    </p>
                </div>
            );
        }

        const roleConfig = {
            lender: {
                icon: Crown,
                iconColor: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                title: "Lender",
                description: "Book Owner",
            },
            borrower: {
                icon: BookOpen,
                iconColor: "text-blue-600",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                title: "Borrower",
                description: "Book Requester",
            },
        };

        const config = roleConfig[role];
        const IconComponent = config.icon;

        return (
            <div
                className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}
            >
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <IconComponent
                            className={`w-5 h-5 ${config.iconColor} mr-2`}
                        />
                        <span className="text-sm font-medium text-gray-900">
                            {config.title}
                        </span>
                    </div>
                    {getUserStatusBadge(user.status)}
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        {user.picture ? (
                            <img
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH +
                                    user.picture
                                }
                                alt={user.name || "User"}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center border-2 border-white shadow-sm">
                                <User className="w-6 h-6 text-gray-600" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "Unknown User"}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                            {config.description}
                        </p>
                        {user.email && (
                            <div className="flex items-center mt-1">
                                <Mail className="w-3 h-3 text-gray-400 mr-1" />
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-3 flex space-x-2">
                    <button
                        onClick={() => handleViewProfile(user)}
                        className="cursor-pointer flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        View Profile
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Participants
            </h3>

            <div className="space-y-4">
                {renderUserCard(lender, "lender")}
                {renderUserCard(borrower, "borrower")}
            </div>
        </div>
    );
}
