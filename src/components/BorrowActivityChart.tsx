"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    CheckCircle,
    XCircle,
    RotateCcw,
    AlertCircle,
    Ban,
    Activity,
    TrendingUp,
} from "lucide-react";

// Interface for the component props
export interface BorrowActivityStats {
    status: string;
    count: number;
    percentage: number;
    trend?: "up" | "down" | "stable";
    trendValue?: number;
}

export interface BorrowActivitiesChartProps {
    data: BorrowActivityStats[];
    totalActivities: number;
    className?: string;
}

const BorrowActivitiesChart: React.FC<BorrowActivitiesChartProps> = ({
    data,
    totalActivities,
    className = "",
}) => {
    const [animatedData, setAnimatedData] = useState<
        (BorrowActivityStats & { animatedPercentage: number })[]
    >([]);

    // Initialize animated data
    useEffect(() => {
        const initialData = data.map((item) => ({
            ...item,
            animatedPercentage: 0,
        }));
        setAnimatedData(initialData);

        // Trigger animation after a short delay
        const timer = setTimeout(() => {
            setAnimatedData(
                data.map((item) => ({
                    ...item,
                    animatedPercentage: item.percentage,
                }))
            );
        }, 100);

        return () => clearTimeout(timer);
    }, [data]);
    const getStatusConfig = (status: string) => {
        const statusConfig = {
            "Pending Borrow Activity": {
                icon: Clock,
                color: "#F59E0B",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                textColor: "text-yellow-700",
            },
            "Accepted By Lender": {
                icon: CheckCircle,
                color: "#10B981",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                textColor: "text-green-700",
            },
            "Borrowing In Progress": {
                icon: Activity,
                color: "#3B82F6",
                bgColor: "bg-blue-50",
                borderColor: "border-blue-200",
                textColor: "text-blue-700",
            },
            "Return Confirmation": {
                icon: RotateCcw,
                color: "#8B5CF6",
                bgColor: "bg-purple-50",
                borderColor: "border-purple-200",
                textColor: "text-purple-700",
            },
            Cancelled: {
                icon: XCircle,
                color: "#EF4444",
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                textColor: "text-red-700",
            },
            Rejected: {
                icon: Ban,
                color: "#F97316",
                bgColor: "bg-orange-50",
                borderColor: "border-orange-200",
                textColor: "text-orange-700",
            },
            Completed: {
                icon: CheckCircle,
                color: "#059669",
                bgColor: "bg-emerald-50",
                borderColor: "border-emerald-200",
                textColor: "text-emerald-700",
            },
        };

        return (
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig["Pending Borrow Activity"]
        );
    };

    const getTrendIcon = (trend?: "up" | "down" | "stable") => {
        if (trend === "up")
            return <TrendingUp className="w-3 h-3 text-green-500" />;
        if (trend === "down")
            return <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />;
        return null;
    };

    return (
        <Card className={`border-0 shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Borrow Activities Overview
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                        {totalActivities} Total
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                {/* Progress Bar Chart */}
                <div className="space-y-4 mb-6">
                    {animatedData.map((item, index) => {
                        const config = getStatusConfig(item.status);
                        const IconComponent = config.icon;

                        return (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <IconComponent
                                            className="w-4 h-4"
                                            style={{ color: config.color }}
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {item.count}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            ({item.percentage.toFixed(1)}%)
                                        </span>
                                        {item.trend && (
                                            <div className="flex items-center gap-1">
                                                {getTrendIcon(item.trend)}
                                                {item.trendValue && (
                                                    <span
                                                        className={`text-xs ${
                                                            item.trend === "up"
                                                                ? "text-green-500"
                                                                : item.trend ===
                                                                  "down"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {item.trendValue > 0
                                                            ? "+"
                                                            : ""}
                                                        {item.trendValue}%
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                        style={{
                                            width: `${item.animatedPercentage}%`,
                                            backgroundColor: config.color,
                                            boxShadow: `inset 0 1px 2px rgba(0,0,0,0.1)`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

// Alternative Table View Component
export const BorrowActivitiesTable: React.FC<BorrowActivitiesChartProps> = ({
    data,
    totalActivities,
    className = "",
}) => {
    const getStatusConfig = (status: string) => {
        const statusConfig = {
            "Pending Borrow Activity": {
                icon: Clock,
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
            },
            "Accepted By Lender": {
                icon: CheckCircle,
                badgeClass: "bg-green-100 text-green-800 border-green-200",
            },
            "Borrowing In Progress": {
                icon: Activity,
                badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
            },
            "Return Confirmation": {
                icon: RotateCcw,
                badgeClass: "bg-purple-100 text-purple-800 border-purple-200",
            },
            Cancelled: {
                icon: XCircle,
                badgeClass: "bg-red-100 text-red-800 border-red-200",
            },
            Rejected: {
                icon: Ban,
                badgeClass: "bg-orange-100 text-orange-800 border-orange-200",
            },
            Completed: {
                icon: CheckCircle,
                badgeClass:
                    "bg-emerald-100 text-emerald-800 border-emerald-200",
            },
        };

        return (
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig["Pending Borrow Activity"]
        );
    };

    return (
        <Card className={`border-0 shadow-sm ${className}`}>
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                        Borrow Activities Summary
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                        {totalActivities} Total Activities
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-3 text-sm font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="text-center py-3 text-sm font-medium text-gray-600">
                                    Count
                                </th>
                                <th className="text-center py-3 text-sm font-medium text-gray-600">
                                    Percentage
                                </th>
                                <th className="text-right py-3 text-sm font-medium text-gray-600">
                                    Trend
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.map((item, index) => {
                                const config = getStatusConfig(item.status);
                                const IconComponent = config.icon;

                                function getTrendIcon(
                                    trend: string
                                ): import("react").ReactNode {
                                    throw new Error(
                                        "Function not implemented."
                                    );
                                }

                                return (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-25 transition-colors"
                                    >
                                        <td className="py-4">
                                            <Badge
                                                variant="secondary"
                                                className={config.badgeClass}
                                            >
                                                <IconComponent className="w-3 h-3 mr-1" />
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="text-center py-4">
                                            <span className="font-semibold text-gray-900">
                                                {item.count}
                                            </span>
                                        </td>
                                        <td className="text-center py-4">
                                            <span className="text-gray-600">
                                                {item.percentage.toFixed(1)}%
                                            </span>
                                        </td>
                                        <td className="text-right py-4">
                                            {item.trend && item.trendValue && (
                                                <div className="flex items-center justify-end gap-1">
                                                    {getTrendIcon(item.trend)}
                                                    <span
                                                        className={`text-sm ${
                                                            item.trend === "up"
                                                                ? "text-green-500"
                                                                : item.trend ===
                                                                  "down"
                                                                ? "text-red-500"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {item.trendValue > 0
                                                            ? "+"
                                                            : ""}
                                                        {item.trendValue}%
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Quick Stats */}
                <div className="flex justify-around pt-6 mt-6 border-t border-gray-100">
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                            {(
                                ((data.find(
                                    (item) => item.status === "Completed"
                                )?.count || 0) /
                                    totalActivities) *
                                100
                            ).toFixed(1)}
                            %
                        </div>
                        <div className="text-xs text-gray-600">
                            Success Rate
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                            {data
                                .filter((item) =>
                                    [
                                        "Borrowing In Progress",
                                        "Return Confirmation",
                                    ].includes(item.status)
                                )
                                .reduce((sum, item) => sum + item.count, 0)}
                        </div>
                        <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">
                            {data.find(
                                (item) =>
                                    item.status === "Pending Borrow Activity"
                            )?.count || 0}
                        </div>
                        <div className="text-xs text-gray-600">
                            Awaiting Action
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BorrowActivitiesChart;
