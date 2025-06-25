"use client";
import {
    fetchDashboardBorrowEvent,
    fetchDashboardStats as fetchDashboardStatsApi,
    fetchPopularGenres,
    transformToBorrowActivityStats,
} from "@/lib/api/dashboard";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Activity } from "lucide-react";
import BorrowActivitiesChart, {
    BorrowActivityStats,
} from "@/components/BorrowActivityChart";
import DonutChart from "@/components/DonutChart";
import { transformToGenreStats } from "@/utils/genreHelper";

interface GenreStats {
    genre: string;
    count: number;
    color: string;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        total_users: 0,
        total_books: 0,
        total_borrow_events: 0,
    });
    const [borrowActivityStats, setBorrowActivityStats] = useState<{
        data: BorrowActivityStats[];
        totalActivities: number;
    }>({ data: [], totalActivities: 0 });
    const [genreStats, setGenreStats] = useState<GenreStats[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboardStats = async () => {
        setLoading(true);
        try {
            const response = await fetchDashboardStatsApi();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch total users:", error);
            setStats({
                total_users: 0,
                total_books: 0,
                total_borrow_events: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const borrowResponse = await fetchDashboardBorrowEvent();
                if (borrowResponse.success) {
                    const transformed = transformToBorrowActivityStats(
                        borrowResponse.data
                    );
                    setBorrowActivityStats(transformed);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        const loadGenreStats = async () => {
            try {
                setLoading(true);
                const response = await fetchPopularGenres();

                if (response.success) {
                    const transformedData = transformToGenreStats(
                        response.data
                    );
                    setGenreStats(transformedData);
                } else {
                    setError("Failed to load genre statistics");
                }
            } catch (err) {
                console.error("Error loading genre stats:", err);
                setError("Failed to load genre statistics");
            } finally {
                setLoading(false);
            }
        };

        loadGenreStats();
    }, []);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return (
        <div className="flex-1 space-y-6 p-6 pt-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Welcome Back, Thavorak!
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Here's what's happening with your library today.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Books
                        </CardTitle>
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-amber-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.total_books}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Available in the system
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Total Users
                        </CardTitle>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.total_users}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Registered members
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-700">
                            Borrow Activities
                        </CardTitle>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Activity className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.total_borrow_events}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                            Active borrow activities
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Borrow Activities Chart */}
                <div className="lg:col-span-2">
                    <BorrowActivitiesChart
                        data={borrowActivityStats.data}
                        totalActivities={borrowActivityStats.totalActivities}
                    />
                </div>

                {/* Popular Book Genres */}
                <div>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                                Popular Book Genres
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DonutChart
                                totalBooks={stats.total_books}
                                data={genreStats}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
