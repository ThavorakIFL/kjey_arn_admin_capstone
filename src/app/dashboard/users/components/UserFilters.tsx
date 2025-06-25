import React from "react";
import { X } from "lucide-react";

interface UserFiltersProps {
    statusFilter: string;
    onStatusChange: (status: string) => void;
    filterCounts: { all: number; active: number; suspended: number };
}

export default function UserFilters({
    statusFilter,
    onStatusChange,
    filterCounts,
}: UserFiltersProps) {
    const statusOptions = [
        { value: "all", label: "All Users", count: filterCounts.all },
        { value: "1", label: "Unsuspended", count: filterCounts.active },
        { value: "0", label: "Suspended", count: filterCounts.suspended },
    ];

    const clearAllFilters = () => {
        onStatusChange("all");
    };

    const hasActiveFilters = statusFilter !== "all";

    return (
        <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Status Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onStatusChange(option.value)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    statusFilter === option.value
                                        ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                                }`}
                            >
                                {option.label}
                                <span
                                    className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                        statusFilter === option.value
                                            ? "bg-blue-200 text-blue-800"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {option.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <div className="flex items-end">
                        <button
                            onClick={clearAllFilters}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
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
                    </div>
                </div>
            )}
        </div>
    );
}
