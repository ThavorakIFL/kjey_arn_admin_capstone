"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Download } from "lucide-react";
import { Book, Genre } from "@/app/types/admin";
import { fetchBooks as fetchBooksData, fetchGenres } from "@/lib/api/books";
import { useRouter } from "next/navigation";
import BookTable from "./components/BookTable";
import BookFilters from "./components/BookFilters";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import BookStats from "./components/BookStats";

export default function BooksPage() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
    const [genreFilter, setGenreFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [filterCounts, setFilterCounts] = useState({
        all: 0,
        available: 0,
        unavailable: 0,
        suspended: 0,
        active: 0,
    });

    useEffect(() => {
        fetchBooks();
    }, [
        searchQuery,
        availabilityFilter,
        genreFilter,
        statusFilter,
        pagination.current_page,
    ]);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const response = await fetchGenres();
                if (response.success) {
                    setGenres(response.data);
                }
            } catch (error) {
                console.error("Error fetching genres:", error);
            }
        };
        loadGenres();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await fetchBooksData({
                search: searchQuery || undefined,
                availability:
                    availabilityFilter === "all"
                        ? undefined
                        : availabilityFilter,
                genre: genreFilter === "all" ? undefined : genreFilter,
                status: statusFilter === "all" ? undefined : statusFilter,
                page: pagination.current_page,
                per_page: pagination.per_page,
            });

            if (response.success) {
                setBooks(response.data.books);
                setPagination(response.data.pagination);
                setFilterCounts(response.data.filter_counts);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleAvailabilityFilter = (availability: string) => {
        setAvailabilityFilter(availability);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleGenreFilter = (genre: string) => {
        setGenreFilter(genre);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const handleBookClick = (book: Book) => {
        router.push(`/dashboard/books/${book.id}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Book's Table
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and monitor all books in the system
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <BookStats
                    totalBooks={pagination.total}
                    availableBooks={filterCounts.available}
                    unavailableBooks={filterCounts.unavailable}
                />
            </div>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search books by title, author, or owner..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`cursor-pointer inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                showFilters
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Filter className="w-4 h-4 mr-2 " />
                            Filters
                        </button>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <BookFilters
                            availabilityFilter={availabilityFilter}
                            genreFilter={genreFilter}
                            statusFilter={statusFilter}
                            onAvailabilityChange={handleAvailabilityFilter}
                            onGenreChange={handleGenreFilter}
                            onStatusChange={handleStatusFilter}
                            filterCounts={filterCounts}
                            availableGenres={genres}
                        />
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{books.length}</span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    books
                </p>
            </div>

            {/* Books Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <BookTable books={books} onBookClick={handleBookClick} />
                )}
            </div>

            {/* Pagination */}
            {!loading && pagination.last_page > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
}
