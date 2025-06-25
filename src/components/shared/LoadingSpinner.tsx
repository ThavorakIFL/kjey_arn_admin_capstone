import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

export default function LoadingSpinner({
    size = "md",
    text = "Loading...",
    className = "",
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    };

    const containerSizeClasses = {
        sm: "py-4",
        md: "py-8",
        lg: "py-12",
    };

    return (
        <div
            className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}
        >
            <Loader2
                className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`}
            />
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
}

// Alternative skeleton loader for table rows
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="animate-pulse">
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gray-300 h-10 w-10"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                        <div className="h-8 bg-gray-300 rounded w-8"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
