"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    User as UserType,
    Book,
    BorrowActivity,
    Genre,
} from "@/app/types/admin";
import {
    ArrowLeft,
    Mail,
    Calendar,
    User,
    BookOpen,
    Activity,
    MoreHorizontal,
    Search,
    Filter,
} from "lucide-react";

// Components
import UserProfileCard from "../components/UserProfileCard";
import UserBorrowActivities from "../components/UserBorrowActivities";
import UserBooksTable from "../components/UserBooksTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
    fetchUserBooksbyId,
    fetchUserBorrowActivitiesbyId,
    fetchUserbyId,
    updateUserStatus,
} from "@/lib/api/users";
import BookFilters from "../../books/components/BookFilters";
import Pagination from "@/components/shared/Pagination";
import { fetchGenres } from "@/lib/api/books";

export default function UserDetailPage({}) {
    const [user, setUser] = useState<UserType | null>(null);
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [booksPagination, setBooksPagination] = useState<PaginationInfo>({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [booksSearchQuery, setBooksSearchQuery] = useState("");
    const [booksAvailabilityFilter, setBooksAvailabilityFilter] =
        useState<string>("all");
    const [booksGenreFilter, setBooksGenreFilter] = useState<string>("all");
    const [booksStatusFilter, setBooksStatusFilter] = useState<string>("all");
    const [showBooksFilters, setShowBooksFilters] = useState(false);
    const [booksFilterCounts, setBooksFilterCounts] = useState({
        all: 0,
        available: 0,
        unavailable: 0,
        active: 0,
        suspended: 0,
    });
    const [borrowActivities, setBorrowActivities] = useState<BorrowActivity[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const [bookLoading, setBookLoading] = useState(true);
    const params = useParams();

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await fetchUserbyId(params.id as string);
            if (response.success) {
                console.log("User data fetched successfully:", response.data);
                setUser(response.data);
            } else {
                console.error("Error fetching user:", response.message);
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserBooks = async () => {
        setBookLoading(true);
        try {
            const parameter = {
                search: booksSearchQuery || undefined,
                availability:
                    booksAvailabilityFilter === "all"
                        ? undefined
                        : booksAvailabilityFilter,
                genre:
                    booksGenreFilter === "all" ? undefined : booksGenreFilter,
                status:
                    booksStatusFilter === "all" ? undefined : booksStatusFilter,
                page: booksPagination.current_page,
                per_page: booksPagination.per_page,
            };
            const response = await fetchUserBooksbyId(
                params.id as string,
                parameter
            );
            if (response.success) {
                setUserBooks(response.data.books);
                setBooksPagination(response.data.pagination);
                setBooksFilterCounts(response.data.filter_counts);
            } else {
                console.error("Error fetching user books:", response.message);
                setUserBooks([]);
            }
        } catch (error) {
            console.error("Error fetching user books:", error);
        } finally {
            setBookLoading(false);
        }
    };

    const handleBooksSearch = (query: string) => {
        setBooksSearchQuery(query);
        setBooksPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleBooksAvailabilityFilter = (availability: string) => {
        setBooksAvailabilityFilter(availability);
        setBooksPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleBooksGenreFilter = (genre: string) => {
        setBooksGenreFilter(genre);
        setBooksPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleBooksStatusFilter = (status: string) => {
        setBooksStatusFilter(status);
        setBooksPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleBooksPageChange = (page: number) => {
        setBooksPagination((prev) => ({ ...prev, current_page: page }));
    };

    const fetchUserBorrowActivities = async () => {
        setLoading(true);
        try {
            const response = await fetchUserBorrowActivitiesbyId(
                params.id as string
            );
            if (response.success) {
                console.log("User books fetched successfully:", response.data);
                setBorrowActivities(response.data);
            } else {
                console.error("Error fetching user books:", response.message);
                setBorrowActivities([]);
            }
        } catch (error) {
            console.error("Error fetching user books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchUserBorrowActivities();
    }, []);

    useEffect(() => {
        if (params.id) {
            fetchUserBooks();
        }
    }, [
        params.id, // Add this
        booksSearchQuery,
        booksAvailabilityFilter,
        booksGenreFilter,
        booksStatusFilter,
        booksPagination.current_page,
        booksPagination.per_page,
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

    const handleGoBack = () => {
        console.log("Go back to users list");
        // router.back
    };

    const handleUserStatusUpdate = async (newStatus: number) => {
        try {
            await updateUserStatus(user!.id!, newStatus);
            window.location.reload(); // Quick fix, or better: update local state
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        User Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The user you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            User Profile
                        </h1>
                        <p className="text-gray-600 mt-1">
                            View and manage user information
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - User Profile Card */}
                <div>
                    <UserProfileCard
                        user={user}
                        onStatusUpdate={handleUserStatusUpdate}
                    />
                </div>

                {/* Right Column - User's Borrow Activity */}
                <div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Current User's Borrow Activity
                        </h2>
                        <UserBorrowActivities activities={borrowActivities} />
                    </div>
                </div>
            </div>

            {/* User's Books Section */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        User's Books
                    </h2>
                </div>

                {/* Search and Filters for Books */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search user's books..."
                                value={booksSearchQuery}
                                onChange={(e) =>
                                    handleBooksSearch(e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() =>
                                setShowBooksFilters(!showBooksFilters)
                            }
                            className={`cursor-pointer inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                showBooksFilters
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Filter className="w-4 h-4 mr-2 " />
                            Filters
                        </button>
                    </div>

                    {showBooksFilters && (
                        <BookFilters
                            availabilityFilter={booksAvailabilityFilter}
                            genreFilter={booksGenreFilter}
                            statusFilter={booksStatusFilter}
                            onAvailabilityChange={handleBooksAvailabilityFilter}
                            onGenreChange={handleBooksGenreFilter}
                            onStatusChange={handleBooksStatusFilter}
                            filterCounts={booksFilterCounts}
                            availableGenres={genres}
                        />
                    )}
                </div>

                <div className="p-6">
                    {bookLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <UserBooksTable books={userBooks} />
                    )}

                    {/* Pagination for Books */}
                    {booksPagination.last_page > 1 && (
                        <div className="mt-6">
                            <Pagination
                                currentPage={booksPagination.current_page}
                                totalPages={booksPagination.last_page}
                                onPageChange={handleBooksPageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
