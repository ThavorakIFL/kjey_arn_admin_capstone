// components/book/BookContent.tsx - Updated for real types
"use client";

import { useState } from "react";
import { useBookSearch } from "@/hooks/useSearch";
import BookStats from "./BookStats";
import BookTable from "./BookTable";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Book } from "@/app/types/admin";

export default function BookContent() {
    const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [genreFilter, setGenreFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("title");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    // Prepare filters for the search hook
    const searchFilters = {
        ...(availabilityFilter !== "all" && {
            availability: availabilityFilter,
        }),
        ...(genreFilter !== "all" && { genre_id: genreFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
        sort_by: sortBy,
        sort_order: sortOrder,
    };

    // Use the enhanced search hook for books
    const {
        results: books,
        total,
        loading,
        error,
        hasMore,
        searchTerm,
        setSearchTerm,
        search,
        loadMore,
        clearResults,
    } = useBookSearch({
        autoSearch: true,
        filters: searchFilters,
    });

    // Handle filter changes from the table component
    const handleFilterChange = (filters: Record<string, string>) => {
        if (filters.availability !== undefined) {
            setAvailabilityFilter(filters.availability);
        }
        if (filters.status !== undefined) {
            setStatusFilter(filters.status);
        }
        if (filters.genre_id !== undefined) {
            // NEW: Handle genre changes
            setGenreFilter(filters.genre_id);
        }
        if (filters.sort_by !== undefined) {
            setSortBy(filters.sort_by);
        }
        if (filters.sort_order !== undefined) {
            setSortOrder(filters.sort_order as "asc" | "desc");
        }
    };

    // Helper functions for your data structure
    const isBookAvailable = (book: Book): boolean => {
        // Assuming availability_id: 1 = available, 0 = unavailable
        return book.availability?.availability_id === 1;
    };

    // Calculate stats from the current results
    const totalBooks = total;
    const availableBooks = books.filter((book) => isBookAvailable(book)).length;
    const unavailableBooks = books.filter(
        (book) => !isBookAvailable(book)
    ).length;

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                {/* Stats Cards - Show zeros during error */}
                <BookStats
                    totalBooks={0}
                    availableBooks={0}
                    unavailableBooks={0}
                />

                {/* Error Message */}
                <div className="bg-white rounded-lg shadow-sm border p-8">
                    <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Something went wrong
                        </h3>
                        <p className="text-gray-600 mb-2">{error}</p>

                        {/* Debug info */}
                        <details className="text-left mt-4 p-4 bg-gray-100 rounded text-sm">
                            <summary className="cursor-pointer font-medium">
                                Debug Info
                            </summary>
                            <div className="mt-2 space-y-1">
                                <p>
                                    <strong>Search Term:</strong>{" "}
                                    {searchTerm || "empty"}
                                </p>
                                <p>
                                    <strong>Availability Filter:</strong>{" "}
                                    {availabilityFilter}
                                </p>
                                <p>
                                    <strong>Genre Filter:</strong> {genreFilter}
                                </p>
                                <p>
                                    <strong>Status Filter:</strong>{" "}
                                    {statusFilter}
                                </p>
                                <p>
                                    <strong>Sort By:</strong> {sortBy}
                                </p>
                                <p>
                                    <strong>Sort Order:</strong> {sortOrder}
                                </p>
                                <p>
                                    <strong>Filters:</strong>{" "}
                                    {JSON.stringify(searchFilters)}
                                </p>
                            </div>
                        </details>

                        <Button
                            onClick={() => search(searchTerm, 1)}
                            variant="outline"
                            className="mt-4"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BookStats
                totalBooks={totalBooks}
                availableBooks={availableBooks}
                unavailableBooks={unavailableBooks}
            />
            {/* Books Table */}
            <BookTable
                books={books}
                loading={loading}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFilterChange={handleFilterChange}
                currentFilters={{
                    availability: availabilityFilter,
                    status: statusFilter,
                    genre_id: genreFilter,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                }}
            />
            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center">
                    <Button
                        onClick={loadMore}
                        disabled={loading}
                        variant="outline"
                        className="min-w-48"
                    >
                        {loading ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Loading more...
                            </>
                        ) : (
                            `Load More (${total - books.length} remaining)`
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
