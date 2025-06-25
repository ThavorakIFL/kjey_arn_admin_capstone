import React from "react";
import { Calendar, MapPin, Clock, Hash, AlertTriangle } from "lucide-react";
import {
    BorrowActivity,
    BorrowEventBorrowStatus,
    MeetUpDetail,
    ReturnDetail,
} from "@/app/types/admin";

interface BorrowActivityDetailsCardProps {
    activity: BorrowActivity;
    meetUpDetail?: MeetUpDetail;
    returnDetail?: ReturnDetail;
}

export default function BorrowActivityDetailsCard({
    activity,
    meetUpDetail,
    returnDetail,
}: BorrowActivityDetailsCardProps) {
    const getStatusBadge = (borrowStatus: BorrowEventBorrowStatus) => {
        const status = borrowStatus.borrow_status.status;
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
                className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
            >
                <div
                    className={`w-2 h-2 ${config.dot} rounded-full mr-2`}
                ></div>
                {status}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    Borrow Event Details
                </h3>
                {getStatusBadge(activity.borrow_status)}
            </div>

            {/* Event Information */}
            <div className="space-y-4">
                {/* Event ID */}
                <div className="flex items-center">
                    <Hash className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Event ID
                        </p>
                        <p className="text-sm text-gray-600">#{activity.id}</p>
                    </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Created
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatDateTime(activity.created_at)}
                        </p>
                    </div>
                </div>

                {/* Borrow Period */}
                {meetUpDetail && (
                    <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                                Borrow Period
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        Start Date
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(meetUpDetail.start_date)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                                        End Date
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(meetUpDetail.end_date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meeting Location */}
                {meetUpDetail?.final_location && (
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Meeting Location
                            </p>
                            <p className="text-sm text-gray-600">
                                {meetUpDetail.final_location}
                            </p>
                        </div>
                    </div>
                )}

                {/* Return Information */}
                {returnDetail && (
                    <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Return Details
                        </h4>
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Expected Return Date
                                </p>
                                <p className="text-sm text-gray-600">
                                    {formatDate(returnDetail.return_date)}
                                </p>
                            </div>
                        </div>
                        {returnDetail.return_location && (
                            <div className="flex items-center mt-2">
                                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Return Location
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {returnDetail.return_location}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
