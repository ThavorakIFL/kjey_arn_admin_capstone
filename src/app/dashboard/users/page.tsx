"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Filter, Plus, Download } from "lucide-react";
import { User } from "@/app/types/admin";
import { fetchUsers as fetchUserApi } from "@/lib/api/users";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";
import Pagination from "../../../components/shared/Pagination";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [filterCounts, setFilterCounts] = useState({
        all: 0,
        active: 0,
        suspended: 0,
    });
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [showFilters, setShowFilters] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetchUserApi({
                search: searchQuery || undefined,
                status: statusFilter === "all" ? undefined : statusFilter,
                page: pagination.current_page,
                per_page: pagination.per_page,
            });

            if (response.success) {
                setUsers(response.data.users);
                setPagination(response.data.pagination);
                setFilterCounts(response.data.filter_counts);
            } else {
                // Handle API error
                console.error("API Error:", response.message);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
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

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const handleUserClick = (user: User) => {
        router.push(`/dashboard/users/${user.id}`);
    };

    const debouncedFetchUsers = useCallback(
        debounce(() => {
            fetchUsers();
        }, 300),
        [searchQuery, statusFilter, pagination.current_page]
    );

    useEffect(() => {
        if (searchQuery || statusFilter !== "all") {
            debouncedFetchUsers();
        } else {
            fetchUsers();
        }
    }, [
        searchQuery,
        statusFilter,
        pagination.current_page,
        debouncedFetchUsers,
    ]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            User's Table
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage and monitor all registered users
                        </p>
                    </div>
                </div>
            </div>

            <div></div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
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
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </button>
                    </div>

                    {/* Expandable Filters */}
                    {showFilters && (
                        <UserFilters
                            filterCounts={filterCounts}
                            statusFilter={statusFilter}
                            onStatusChange={handleStatusFilter}
                        />
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{users.length}</span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    users
                </p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <UserTable users={users} onUserClick={handleUserClick} />
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
