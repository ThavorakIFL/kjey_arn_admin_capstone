"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Filter,
    Eye,
    AlertTriangle,
    Calendar,
    User,
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    MoreHorizontal,
    RefreshCw,
    Download,
    FilterX,
} from "lucide-react";
import {
    fetchReportedBorrowActivities,
    ReportedBorrowEvent,
    ReportsQueryParams,
    BorrowEventReport,
    Book,
    User as UserType,
} from "@/lib/api/report";

export default function ReportsPage() {
    const router = useRouter();
    const [reports, setReports] = useState<ReportedBorrowEvent[]>([]);
    const [filteredReports, setFilteredReports] = useState<
        ReportedBorrowEvent[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<number | "all">("all");
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch reports from API
    const fetchReports = async (params?: ReportsQueryParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchReportedBorrowActivities(params);
            setReports(response.data);
            setFilteredReports(response.data);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
            setError("Failed to load reports. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchReports();
    }, []);

    // Search and filter functionality
    useEffect(() => {
        let filtered = reports;

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (report) =>
                    report.book
                        .title!.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    report.borrower.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    report.lender.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    report.borrow_event_report.reason
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (report) => report.borrow_event_report.status === statusFilter
            );
        }

        setFilteredReports(filtered);
    }, [searchQuery, statusFilter, reports]);

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchReports();
        setRefreshing(false);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
    };

    // Utility functions
    const getStatusBadge = (status: number) => {
        switch (status) {
            case 0:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 1:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200"
                    >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Resolved
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-800 border-gray-200"
                    >
                        Unknown
                    </Badge>
                );
        }
    };

    const getReportedBy = (report: ReportedBorrowEvent): UserType => {
        return report.borrow_event_report.reported_by === report.borrower_id
            ? report.borrower
            : report.lender;
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusCount = (status: number): number => {
        return reports.filter(
            (report) => report.borrow_event_report.status === status
        ).length;
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="flex-1 space-y-6 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-32 bg-gray-200 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex-1 space-y-6 p-6">
                <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Error Loading Reports
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => fetchReports()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Reports
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Monitor and manage borrow event reports and disputes
                    </p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Total Reports
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {reports.length}
                                </p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {getStatusCount(0)}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Resolved
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {getStatusCount(1)}
                                </p>
                            </div>
                            <CheckCircle2 className="w-8 h-8 text-green-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by book title, borrower, lender, or report reason..."
                                className="pl-10 h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value === "all"
                                            ? "all"
                                            : Number(e.target.value)
                                    )
                                }
                                className="h-10 px-3 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value={0}>
                                    Pending ({getStatusCount(0)})
                                </option>
                                <option value={1}>
                                    Resolved ({getStatusCount(1)})
                                </option>
                            </select>

                            {(searchQuery || statusFilter !== "all") && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    size="sm"
                                >
                                    <FilterX className="w-4 h-4 mr-1" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Showing {filteredReports.length} of {reports.length}{" "}
                            reports
                        </span>
                        {(searchQuery || statusFilter !== "all") && (
                            <span className="text-blue-600">
                                Filters applied
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                        const reportedBy = getReportedBy(report);

                        return (
                            <Card
                                key={report.id}
                                className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        {/* Left Section - Book and Report Info */}
                                        <div className="flex gap-4 flex-1">
                                            {/* Book Cover Placeholder */}
                                            <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                                                {report.book.pictures &&
                                                report.book.pictures.length >
                                                    0 ? (
                                                    <img
                                                        className=" object-cover rounded-md border border-gray-200"
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH +
                                                            report.book
                                                                .pictures[0]
                                                                .picture
                                                        }
                                                        alt={
                                                            report.book.title ||
                                                            "Book cover"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="h-16 w-12 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                                        <BookOpen className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Report Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                                                            {report.book.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            by{" "}
                                                            {report.book.author}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(
                                                        report
                                                            .borrow_event_report
                                                            .status
                                                    )}
                                                </div>

                                                {/* Participants */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            {report.borrower!
                                                                .picture ? (
                                                                <img
                                                                    className="h-8 w-8 rounded-full object-cover"
                                                                    src={
                                                                        process
                                                                            .env
                                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                                        report
                                                                            .borrower
                                                                            .picture!
                                                                    }
                                                                    alt={
                                                                        report
                                                                            .borrower
                                                                            .name ||
                                                                        "User"
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-gray-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                                Borrower
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {
                                                                    report
                                                                        .borrower
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {report.lender!
                                                            .picture ? (
                                                            <img
                                                                className="h-8 w-8 rounded-full object-cover"
                                                                src={
                                                                    process.env
                                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                                    report.lender!
                                                                        .picture
                                                                }
                                                                alt={
                                                                    report.lender!
                                                                        .name ||
                                                                    "User"
                                                                }
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-gray-600" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                                Lender
                                                            </p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {
                                                                    report
                                                                        .lender
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Report Details */}
                                                <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                                    <div className="flex items-start gap-3">
                                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-red-900 mb-1">
                                                                Reported by:{" "}
                                                                <span className="font-semibold">
                                                                    {
                                                                        reportedBy.name
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-red-800 leading-relaxed">
                                                                "
                                                                {
                                                                    report
                                                                        .borrow_event_report
                                                                        .reason
                                                                }
                                                                "
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Date Information */}
                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>
                                                            Report:{" "}
                                                            {formatDate(
                                                                report
                                                                    .borrow_event_report
                                                                    .created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>
                                                            Event:{" "}
                                                            {formatDate(
                                                                report.created_at
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-400">
                                                        •
                                                    </div>
                                                    <span>
                                                        ID: #{report.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section - Actions */}
                                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                            <Button
                                                onClick={() => {
                                                    router.push(
                                                        `/dashboard/borrow-activities/${report.borrow_event_report.borrow_event_id}`
                                                    );
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="hover:bg-blue-50 cursor-pointer"
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-12 text-center">
                            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No reports found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {searchQuery || statusFilter !== "all"
                                    ? "No reports match your current filters. Try adjusting your search criteria."
                                    : "There are currently no reports to display. This is a good sign!"}
                            </p>
                            {(searchQuery || statusFilter !== "all") && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                >
                                    <FilterX className="w-4 h-4 mr-2" />
                                    Clear all filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
