import React from "react";
import { X, Calendar } from "lucide-react";

interface BorrowStatus {
    id: number;
    status: string;
}

interface BorrowActivityFiltersProps {
    statusFilter: string;
    dateFilter: string;
    onStatusChange: (status: string) => void;
    onDateChange: (date: string) => void;
    borrowStatuses: BorrowStatus[];
    filterCounts: {
        all: number;
        pending: number;
        accepted: number;
        rejected: number;
        in_progress: number;
        completed: number;
        cancelled: number;
    };
}

export default function BorrowActivityFilters({
    statusFilter,
    dateFilter,
    onStatusChange,
    onDateChange,
    borrowStatuses,
    filterCounts,
}: BorrowActivityFiltersProps) {
    // Map status IDs to filter count keys
    const getStatusCount = (statusId: number) => {
        const countMapping: { [key: number]: keyof typeof filterCounts } = {
            1: "pending",
            2: "accepted",
            3: "rejected",
            4: "in_progress",
            5: "completed",
            6: "cancelled",
        };
        return filterCounts[countMapping[statusId]] || 0;
    };

    const statusOptions = [
        { value: "all", label: "All Activities", count: filterCounts.all },
        ...borrowStatuses.map((status) => ({
            value: status.id.toString(),
            label: status.status,
            count: getStatusCount(status.id),
        })),
    ];

    const dateOptions = [
        { value: "all", label: "All Time" },
        { value: "today", label: "Today" },
        { value: "this_week", label: "This Week" },
        { value: "this_month", label: "This Month" },
        { value: "last_month", label: "Last Month" },
        { value: "this_year", label: "This Year" },
    ];

    const clearAllFilters = () => {
        onStatusChange("all");
        onDateChange("all");
    };

    const hasActiveFilters = statusFilter !== "all" || dateFilter !== "all";

    const getStatusColor = (statusId: string) => {
        const colorMapping: { [key: string]: string } = {
            "1": "yellow", // Pending
            "2": "blue", // Accepted
            "3": "red", // Rejected
            "4": "purple", // In Progress
            "5": "green", // Completed
            "6": "gray", // Cancelled
            "7": "orange", // Ready for Return
            "8": "red", // Reported
        };
        return colorMapping[statusId] || "gray";
    };

    const getStatusButtonClasses = (statusId: string, isSelected: boolean) => {
        const color = getStatusColor(statusId);

        if (isSelected) {
            return {
                yellow: "bg-yellow-100 text-yellow-800 border-2 border-yellow-300",
                blue: "bg-blue-100 text-blue-800 border-2 border-blue-300",
                red: "bg-red-100 text-red-800 border-2 border-red-300",
                purple: "bg-purple-100 text-purple-800 border-2 border-purple-300",
                green: "bg-green-100 text-green-800 border-2 border-green-300",
                gray: "bg-gray-100 text-gray-800 border-2 border-gray-300",
                orange: "bg-orange-100 text-orange-800 border-2 border-orange-300",
            }[color];
        }

        return "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200";
    };

    const getStatusCountClasses = (statusId: string, isSelected: boolean) => {
        const color = getStatusColor(statusId);

        if (isSelected) {
            return {
                yellow: "bg-yellow-200 text-yellow-800",
                blue: "bg-blue-200 text-blue-800",
                red: "bg-red-200 text-red-800",
                purple: "bg-purple-200 text-purple-800",
                green: "bg-green-200 text-green-800",
                gray: "bg-gray-200 text-gray-800",
                orange: "bg-orange-200 text-orange-800",
            }[color];
        }

        return "bg-gray-200 text-gray-600";
    };

    return (
        <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map((option) => {
                            const isSelected = statusFilter === option.value;
                            const statusClasses =
                                option.value === "all"
                                    ? isSelected
                                        ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-300"
                                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                                    : getStatusButtonClasses(
                                          option.value,
                                          isSelected
                                      );
                            const countClasses =
                                option.value === "all"
                                    ? isSelected
                                        ? "bg-indigo-200 text-indigo-800"
                                        : "bg-gray-200 text-gray-600"
                                    : getStatusCountClasses(
                                          option.value,
                                          isSelected
                                      );

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onStatusChange(option.value)}
                                    className={`inline-flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${statusClasses}`}
                                >
                                    <span className="truncate">
                                        {option.label}
                                    </span>
                                    <span
                                        className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${countClasses}`}
                                    >
                                        {option.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Date Range
                    </label>
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                            {dateOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => onDateChange(option.value)}
                                    className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        dateFilter === option.value
                                            ? "bg-indigo-100 text-indigo-800 border-2 border-indigo-300"
                                            : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                                    }`}
                                >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Filters & Active Filters */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">
                            Active filters:
                        </span>
                        {statusFilter !== "all" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                                Status:{" "}
                                {
                                    statusOptions.find(
                                        (opt) => opt.value === statusFilter
                                    )?.label
                                }
                                <button
                                    onClick={() => onStatusChange("all")}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {dateFilter !== "all" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-indigo-100 text-indigo-800">
                                Date:{" "}
                                {
                                    dateOptions.find(
                                        (opt) => opt.value === dateFilter
                                    )?.label
                                }
                                <button
                                    onClick={() => onDateChange("all")}
                                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                    <button
                        onClick={clearAllFilters}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <X className="w-4 h-4 mr-1" />
                        Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
