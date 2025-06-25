"use client";

import { useState, useEffect } from "react";
import { useUserSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    AlertCircle,
    Users,
    RefreshCw,
    UserCheck,
    UserX,
    Eye,
    Filter,
    X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AdminSearch } from "@/components/AdminSearch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function UserContent() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const searchFilters = {
        ...(statusFilter !== "all" && { status: statusFilter }),
        sort_by: sortBy,
        sort_order: sortOrder,
    };

    // Debug log the filters
    useEffect(() => {
        console.log("🔍 Filter State Debug:", {
            statusFilter,
            sortBy,
            sortOrder,
            searchFilters,
            statusFilterType: typeof statusFilter,
        });
    }, [statusFilter, sortBy, sortOrder, searchFilters]);

    // Use the enhanced search hook with filters
    const {
        results: users,
        total,
        loading,
        error,
        hasMore,
        searchTerm,
        setSearchTerm,
        search,
        loadMore,
        clearResults,
    } = useUserSearch({
        autoSearch: true,
        filters: searchFilters,
    });

    const handleStatusUpdate = async (
        userId: string | number | undefined,
        currentStatus: boolean
    ) => {
        try {
            const newStatus = !currentStatus;
            toast.success(
                `User ${newStatus ? "unsuspended" : "suspended"} successfully`
            );

            // Refresh search results
            if (searchTerm) {
                await search(searchTerm, 1);
            }
        } catch (error) {
            toast.error("Failed to update user status. Please try again.");
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        switch (key) {
            case "status":
                setStatusFilter(value);
                break;
            case "sort_by":
                setSortBy(value);
                break;
            case "sort_order":
                setSortOrder(value as "asc" | "desc");
                break;
        }
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setSortBy("created_at");
        setSortOrder("desc");
    };

    console.log(users);

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-gray-600 mb-2">{error}</p>

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
                                <strong>Status Filter:</strong> {statusFilter}
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
        );
    }

    // Calculate stats
    const activeUsers = users.filter((user) => user.status === 1).length;
    const suspendedUsers = users.filter((user) => user.status === 0).length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {total}
                            </p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Unsuspended Users (Current Results)
                            </p>
                            <p className="text-2xl font-semibold text-green-600">
                                {activeUsers}
                            </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <UserCheck className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Suspended Users (Current Results)
                            </p>
                            <p className="text-2xl font-semibold text-red-600">
                                {suspendedUsers}
                            </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                            <UserX className="h-6 w-6 text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                {/* Search and Filters */}
                <div className="p-6 border-b space-y-4">
                    {/* Search Bar */}
                    <AdminSearch
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        placeholder="Search users by name or email..."
                        isSearching={loading}
                        className="w-full"
                    />

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                                Filters:
                            </span>
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={(value) =>
                                handleFilterChange("status", value)
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="1">Unsuspended</SelectItem>
                                <SelectItem value="0">Suspended</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sortBy}
                            onValueChange={(value) =>
                                handleFilterChange("sort_by", value)
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="created_at">
                                    Date Created
                                </SelectItem>
                                <SelectItem value="status">Status</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={sortOrder}
                            onValueChange={(value) =>
                                handleFilterChange("sort_order", value)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>

                        {(statusFilter !== "all" ||
                            sortBy !== "created_at" ||
                            sortOrder !== "desc") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear
                            </Button>
                        )}
                    </div>

                    {/* Results info */}
                    {searchTerm && (
                        <p className="text-sm text-gray-600">
                            {users.length} of {total} users shown for "
                            {searchTerm}"
                        </p>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b">
                            <tr>
                                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                    User
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                    Email
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                    Books
                                </th>
                                <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                    Status
                                </th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, index) => {
                                const isUnsuspended = user.status === 1;

                                return (
                                    <tr
                                        key={user.id || index}
                                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/users/${user.id}`
                                            )
                                        }
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                                                    <AvatarImage
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH! +
                                                            user.picture
                                                        }
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                                        {user.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <span className="font-medium text-gray-900">
                                                        {user.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-700 text-sm">
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-gray-700 text-sm font-medium">
                                                {user.books_count || 0}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        isUnsuspended
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                                                        isUnsuspended
                                                            ? "text-green-700 bg-green-50"
                                                            : "text-red-700 bg-red-50"
                                                    }`}
                                                >
                                                    {isUnsuspended
                                                        ? "Unsuspended"
                                                        : "Suspended"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-48"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(
                                                                `/dashboard/users/${user.id}`
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(
                                                                user.id || "",
                                                                user.status ===
                                                                    1
                                                            );
                                                        }}
                                                        className={
                                                            isUnsuspended
                                                                ? "text-red-600 focus:text-red-600"
                                                                : "text-green-600 focus:text-green-600"
                                                        }
                                                    >
                                                        {isUnsuspended ? (
                                                            <>
                                                                <UserX className="h-4 w-4 mr-2" />
                                                                Suspend User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UserCheck className="h-4 w-4 mr-2" />
                                                                Unsuspend User
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="p-6 border-t">
                        <Button
                            onClick={loadMore}
                            disabled={loading}
                            variant="outline"
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Loading more...
                                </>
                            ) : (
                                `Load More (${total - users.length} remaining)`
                            )}
                        </Button>
                    </div>
                )}

                {/* No Results */}
                {!loading && users.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm ? "No users found" : "No users yet"}
                        </h3>
                        <p className="text-gray-600">
                            {searchTerm
                                ? `No users match your search for "${searchTerm}".`
                                : "Get started by adding your first user to the system."}
                        </p>
                        {searchTerm && (
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => setSearchTerm("")}
                            >
                                Clear search
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
