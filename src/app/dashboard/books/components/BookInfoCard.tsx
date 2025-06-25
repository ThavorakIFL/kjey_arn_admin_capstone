import React from "react";
import { Calendar, Hash, FileText, Star } from "lucide-react";

interface Book {
    id?: number;
    title?: string;
    author?: string;
    condition?: number;
    description?: string;
    status?: number;
    created_at?: string;
    genres?: Genre[];
}

interface Genre {
    id?: number;
    genre?: string;
}

interface BookInfoCardProps {
    book: Book;
}

export default function BookInfoCard({ book }: BookInfoCardProps) {
    const getStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        Unsuspended
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        Unknown
                    </span>
                );
        }
    };

    const getConditionColor = (condition?: number) => {
        if (!condition) return "bg-gray-400";
        if (condition >= 80) return "bg-green-500";
        if (condition >= 60) return "bg-yellow-500";
        if (condition >= 40) return "bg-orange-500";
        return "bg-red-500";
    };

    const getConditionText = (condition?: number) => {
        if (!condition) return "Unknown";
        if (condition >= 80) return "Excellent";
        if (condition >= 60) return "Good";
        if (condition >= 40) return "Fair";
        return "Poor";
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Book Title and Status */}
            <div className="mb-6">
                <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                        {book.title || "Unknown Title"}
                    </h2>
                    {getStatusBadge(book.status)}
                </div>
                <p className="text-lg text-gray-600">
                    by {book.author || "Unknown Author"}
                </p>
            </div>

            {/* Genres */}
            {book.genres && book.genres.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {book.genres.map((genre) => (
                            <span
                                key={genre.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                                {genre.genre}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Condition */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                        Condition
                    </h3>
                    <span className="text-sm font-medium text-gray-900">
                        {book.condition || 0}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-300 ${getConditionColor(
                            book.condition
                        )}`}
                        style={{ width: `${book.condition || 0}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                    {getConditionText(book.condition)}
                </p>
            </div>

            {/* Description */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                        {book.description || "No description available."}
                    </p>
                </div>
            </div>

            {/* Book Details */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                    <Hash className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Book ID
                        </p>
                        <p className="text-sm text-gray-600">#{book.id}</p>
                    </div>
                </div>

                <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Listed On
                        </p>
                        <p className="text-sm text-gray-600">
                            {formatDate(book.created_at)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
