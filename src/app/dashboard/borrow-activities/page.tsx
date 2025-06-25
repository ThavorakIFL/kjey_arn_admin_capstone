"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, Download, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
// Components (these would be separate files in your project)
import BorrowActivityTable from "./components/BorrowActivityTable";
import BorrowActivityFilters from "./components/BorrowActivityFilters";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { BorrowActivity, BorrowStatusDetail } from "@/app/types/admin";
import {
    fetchBorrowActivities,
    fetchBorrowStatuses as fetchBorrowStatusesData,
} from "@/lib/api/boorrowActivities";

export default function BorrowActivitiesPage() {
    const router = useRouter();
    const [activities, setActivities] = useState<BorrowActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateFilter, setDateFilter] = useState<string>("all");
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [showFilters, setShowFilters] = useState(false);
    const [borrowStatuses, setBorrowStatuses] = useState<BorrowStatusDetail[]>(
        []
    );
    const [filterCounts, setFilterCounts] = useState({
        all: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        in_progress: 0,
        completed: 0,
        cancelled: 0,
    });
    useEffect(() => {
        fetchActivities();
        fetchBorrowStatuses();
    }, [searchQuery, statusFilter, dateFilter, pagination.current_page]);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const response = await fetchBorrowActivities({
                search: searchQuery || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
                date_filter: dateFilter === "all" ? undefined : dateFilter,
                page: pagination.current_page,
                per_page: pagination.per_page,
            });

            if (response.success) {
                setActivities(response.data.activities);
                setPagination(response.data.pagination);
                setFilterCounts(response.data.filter_counts);
            }
        } catch (error) {
            console.error("Error fetching borrow activities:", error);
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchBorrowStatuses = async () => {
        try {
            const response = await fetchBorrowStatusesData();
            if (response.success) {
                setBorrowStatuses(response.data);
            }
        } catch (error) {
            console.error("Error fetching borrow statuses:", error);
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handleDateFilter = (date: string) => {
        setDateFilter(date);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const handleActivityClick = (activity: BorrowActivity) => {
        // Navigate to activity detail page
        // console.log("View activity:", activity);
        router.push(`/dashboard/borrow-activities/${activity.id}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Borrow Activities Table
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Monitor all borrowing activities and transactions
                        </p>
                    </div>
                </div>
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
                                placeholder="Search by book title, borrower, lender, or status..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                                showFilters
                                    ? "bg-blue-50 border-blue-200 text-blue-700"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <BorrowActivityFilters
                            statusFilter={statusFilter}
                            dateFilter={dateFilter}
                            onStatusChange={handleStatusFilter}
                            onDateChange={handleDateFilter}
                            borrowStatuses={borrowStatuses}
                            filterCounts={filterCounts}
                        />
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{activities.length}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    activities
                </p>
            </div>

            {/* Activities Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <BorrowActivityTable
                        activities={activities}
                        onActivityClick={handleActivityClick}
                    />
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
