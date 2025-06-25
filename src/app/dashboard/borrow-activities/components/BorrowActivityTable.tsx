import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Eye,
    Calendar,
    MapPin,
    BookOpen,
    User,
    Clock,
} from "lucide-react";
import { BorrowActivity, BorrowEventBorrowStatus } from "@/app/types/admin";

interface BorrowActivityTableProps {
    activities: BorrowActivity[];
    onActivityClick: (activity: BorrowActivity) => void;
}

export default function BorrowActivityTable({
    activities,
    onActivityClick,
}: BorrowActivityTableProps) {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const getStatusBadge = (borrowStatus: BorrowEventBorrowStatus) => {
        const status = borrowStatus.borrow_status.status || "Unknown Status";
        const statusId = borrowStatus.borrow_status_id;

        const statusConfig = {
            1: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                dot: "bg-yellow-400",
            }, // Pending
            2: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-400" }, // Accepted
            3: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" }, // Rejected
            4: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                dot: "bg-purple-400",
            }, // In Progress
            5: {
                bg: "bg-green-100",
                text: "text-green-800",
                dot: "bg-green-400",
            }, // Completed
            6: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-400" }, // Cancelled
            7: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                dot: "bg-orange-400",
            }, // Ready for Return
            8: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-400" }, // Reported
        };

        const config =
            statusConfig[statusId as keyof typeof statusConfig] ||
            statusConfig[1];

        return (
            <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
            >
                <div
                    className={`w-1.5 h-1.5 ${config.dot} rounded-full mr-1.5`}
                ></div>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateRange = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
            start.getFullYear() === end.getFullYear() &&
            start.getMonth() === end.getMonth()
        ) {
            return `${start.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })} - ${end.getDate()}, ${end.getFullYear()}`;
        }

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const handleActionClick = (
        e: React.MouseEvent,
        action: string,
        activity: BorrowActivity
    ) => {
        e.stopPropagation();
        router.push(`/dashboard/borrow-activities/${activity.id}`);
    };

    if (activities.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No borrow activities found
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
            <div className="hidden xl:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Book
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Borrower
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start - End Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pick Up Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Borrow Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {activities.map((activity) => (
                            <tr
                                key={activity.id}
                                onClick={() => onActivityClick(activity)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-12 w-9">
                                            {activity.book.pictures &&
                                            activity.book.pictures.length >
                                                0 ? (
                                                <img
                                                    className="h-12 w-9 object-cover rounded-md border border-gray-200"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        activity.book
                                                            .pictures[0].picture
                                                    }
                                                    alt={
                                                        activity.book.title ||
                                                        "Book cover"
                                                    }
                                                />
                                            ) : (
                                                <div className="h-12 w-9 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                                    <BookOpen className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {activity.book.title ||
                                                    "Unknown Title"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                by{" "}
                                                {activity.book.author ||
                                                    "Unknown Author"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            {activity.lender.picture ? (
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        activity.lender.picture
                                                    }
                                                    alt={
                                                        activity.lender.name ||
                                                        "Lender"
                                                    }
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.lender.name ||
                                                    "Unknown Lender"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            {activity.borrower.picture ? (
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        activity.borrower
                                                            .picture
                                                    }
                                                    alt={
                                                        activity.borrower
                                                            .name || "Borrower"
                                                    }
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {activity.borrower.name ||
                                                    "Unknown Borrower"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {activity.meet_up_detail ? (
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">
                                                {formatDateRange(
                                                    activity.meet_up_detail
                                                        .start_date,
                                                    activity.meet_up_detail
                                                        .end_date
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            No dates set
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {activity.meet_up_detail?.final_location ? (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                            <div className="text-sm text-gray-900">
                                                {
                                                    activity.meet_up_detail
                                                        .final_location
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            Location TBD
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(activity.borrow_status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={(e) =>
                                                handleActionClick(
                                                    e,
                                                    "view",
                                                    activity
                                                )
                                            }
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4 cursor-pointer" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="xl:hidden divide-y divide-gray-200">
                {activities.map((activity) => (
                    <div
                        key={activity.id}
                        onClick={() => onActivityClick(activity)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                {activity.book.pictures &&
                                activity.book.pictures.length > 0 ? (
                                    <img
                                        className="h-16 w-12 object-cover rounded-md border border-gray-200"
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            activity.book.pictures[0].picture
                                        }
                                        alt={
                                            activity.book.title || "Book cover"
                                        }
                                    />
                                ) : (
                                    <div className="h-16 w-12 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {activity.book.title ||
                                                "Unknown Title"}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            by{" "}
                                            {activity.book.author ||
                                                "Unknown Author"}
                                        </div>

                                        {/* Lender & Borrower */}
                                        <div className="flex items-center mt-2 space-x-4">
                                            <div className="flex items-center">
                                                <span className="text-xs text-gray-500 mr-1">
                                                    Lender:
                                                </span>
                                                {activity.lender.picture ? (
                                                    <img
                                                        className="h-5 w-5 rounded-full object-cover mr-1"
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH +
                                                            activity.lender
                                                                .picture
                                                        }
                                                        alt={
                                                            activity.lender
                                                                .name ||
                                                            "Lender"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center mr-1">
                                                        <User className="h-3 w-3 text-gray-600" />
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-700 truncate">
                                                    {activity.lender.name}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <span className="text-xs text-gray-500 mr-1">
                                                    Borrower:
                                                </span>
                                                {activity.borrower.picture ? (
                                                    <img
                                                        className="h-5 w-5 rounded-full object-cover mr-1"
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH +
                                                            activity.borrower
                                                                .picture
                                                        }
                                                        alt={
                                                            activity.borrower
                                                                .name ||
                                                            "Borrower"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center mr-1">
                                                        <User className="h-3 w-3 text-gray-600" />
                                                    </div>
                                                )}
                                                <span className="text-xs text-gray-700 truncate">
                                                    {activity.borrower.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Date and Location */}
                                        <div className="mt-2 space-y-1">
                                            {activity.meet_up_detail && (
                                                <div className="flex items-center">
                                                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                                    <span className="text-xs text-gray-600">
                                                        {formatDateRange(
                                                            activity
                                                                .meet_up_detail
                                                                .start_date,
                                                            activity
                                                                .meet_up_detail
                                                                .end_date
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            {activity.meet_up_detail
                                                ?.final_location && (
                                                <div className="flex items-center">
                                                    <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                                                    <span className="text-xs text-gray-600">
                                                        {
                                                            activity
                                                                .meet_up_detail
                                                                .final_location
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="mt-2">
                                            {getStatusBadge(
                                                activity.borrow_status
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) =>
                                            handleActionClick(
                                                e,
                                                "view",
                                                activity
                                            )
                                        }
                                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4 cursor-pointer" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
