import React from "react";
import { X } from "lucide-react";
import { Genre } from "@/app/types/admin";

interface BookFiltersProps {
    availabilityFilter: string;
    genreFilter: string;
    statusFilter: string;
    onAvailabilityChange: (availability: string) => void;
    onGenreChange: (genre: string) => void;
    onStatusChange: (status: string) => void;
    filterCounts: {
        all: number;
        available: number;
        unavailable: number;
        active: number;
        suspended: number;
    };
    availableGenres: Genre[];
}

export default function BookFilters({
    availabilityFilter,
    genreFilter,
    statusFilter,
    onAvailabilityChange,
    onGenreChange,
    onStatusChange,
    filterCounts,
    availableGenres,
}: BookFiltersProps) {
    const availabilityOptions = [
        { value: "all", label: "All Books", count: filterCounts.all },
        { value: "1", label: "Available", count: filterCounts.available },
        { value: "2", label: "Unavailable", count: filterCounts.unavailable },
    ];

    const statusOptions = [
        { value: "all", label: "All Status", count: filterCounts.all },
        { value: "1", label: "Active", count: filterCounts.active },
        { value: "0", label: "Suspended", count: filterCounts.suspended },
    ];

    const genreOptions = [
        { value: "all", label: "All Genres" },
        ...availableGenres.map((genre) => ({
            value: genre.id!.toString(),
            label: genre.genre!,
        })),
    ];

    const clearAllFilters = () => {
        onAvailabilityChange("all");
        onGenreChange("all");
        onStatusChange("all");
    };

    const hasActiveFilters =
        availabilityFilter !== "all" ||
        genreFilter !== "all" ||
        statusFilter !== "all";

    return (
        <div className="pt-4 border-t border-gray-200 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Availability Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {availabilityOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    onAvailabilityChange(option.value)
                                }
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    availabilityFilter === option.value
                                        ? "bg-green-100 text-green-800 border-2 border-green-300"
                                        : "bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200"
                                }`}
                            >
                                {option.label}
                                <span
                                    className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                                        availabilityFilter === option.value
                                            ? "bg-green-200 text-green-800"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    {option.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Book Status
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

                {/* Genre Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre
                    </label>
                    <select
                        value={genreFilter}
                        onChange={(e) => onGenreChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                        {genreOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                            Active filters:
                        </span>
                        {availabilityFilter !== "all" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-green-100 text-green-800">
                                Availability:{" "}
                                {
                                    availabilityOptions.find(
                                        (opt) =>
                                            opt.value === availabilityFilter
                                    )?.label
                                }
                                <button
                                    onClick={() => onAvailabilityChange("all")}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {genreFilter !== "all" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-purple-100 text-purple-800">
                                Genre:{" "}
                                {
                                    genreOptions.find(
                                        (opt) => opt.value === genreFilter
                                    )?.label
                                }
                                <button
                                    onClick={() => onGenreChange("all")}
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
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
