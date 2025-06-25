import React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, User } from "lucide-react";
import { BorrowActivity, BorrowEventBorrowStatus } from "@/app/types/admin";

interface UserBorrowActivitiesProps {
    activities: BorrowActivity[];
}

export default function UserBorrowActivities({
    activities,
}: UserBorrowActivitiesProps) {
    const router = useRouter();
    const getStatusBadge = (borrowStatus: BorrowEventBorrowStatus) => {
        const status = borrowStatus.borrow_status.status;
        const statusId = borrowStatus.borrow_status_id;

        const statusConfig = {
            1: {
                bg: "bg-yellow-100",
                text: "text-yellow-800",
                label: "Pending Request",
            },
            2: {
                bg: "bg-blue-100",
                text: "text-blue-800",
                label: "Accepted by Lender",
            },
            3: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
            4: {
                bg: "bg-purple-100",
                text: "text-purple-800",
                label: "Borrowing in Progress",
            },
            5: {
                bg: "bg-green-100",
                text: "text-green-800",
                label: "Completed",
            },
            6: { bg: "bg-gray-100", text: "text-gray-800", label: "Cancelled" },
            7: {
                bg: "bg-orange-100",
                text: "text-orange-800",
                label: "Ready for Return",
            },
            8: { bg: "bg-red-100", text: "text-red-800", label: "Reported" },
        };

        const config =
            statusConfig[statusId as keyof typeof statusConfig] ||
            statusConfig[1];

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
            >
                {config.label}
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

    if (activities.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Borrow Activities
                </h3>
                <p className="text-gray-500">
                    This user hasn't borrowed any books yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    onClick={() => {
                        router.push(
                            `/dashboard/borrow-activities/${activity.id}`
                        );
                    }}
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    {/* Book Cover */}
                    <div className="flex-shrink-0">
                        {activity.book.pictures &&
                        activity.book.pictures.length > 0 ? (
                            <img
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH +
                                    activity.book.pictures[0].picture
                                }
                                alt={activity.book.title || "Book cover"}
                                className="w-12 h-16 object-cover rounded-md border border-gray-200"
                            />
                        ) : (
                            <div className="w-12 h-16 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                <BookOpen className="w-6 h-6 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {activity.book.title || "Unknown Title"}
                                </h3>

                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                    <span>Lender: </span>
                                    <span className="ml-1 font-medium">
                                        {activity.lender.name || "Unknown"}
                                    </span>
                                </div>

                                <div className="flex items-center mt-1 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    <span>
                                        {formatDate(activity.created_at)}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex-shrink-0">
                                {getStatusBadge(activity.borrow_status)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
