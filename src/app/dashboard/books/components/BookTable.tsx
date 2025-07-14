import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    BookOpen,
    User,
    Calendar,
} from "lucide-react";
import { Book, BookAvailability, Genre } from "@/app/types/admin";
import { updateBookStatus } from "@/lib/api/books";
import { toast } from "sonner";

interface BookTableProps {
    books: Book[];
    onBookClick: (book: Book) => void;
}

export default function BookTable({ books, onBookClick }: BookTableProps) {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const router = useRouter();
    // const handleStatusUpdate = async (book: Book, newStatus: number) => {
    //     try {
    //         await updateBookStatus(book.id!, newStatus);
    //         window.location.reload(); // Quick fix, or better: update local state
    //     } catch (error) {
    //         console.error("Failed to update book status:", error);
    //     }
    //     setOpenDropdown(null);
    // };

    const handleStatusUpdate = async (book: Book, newStatus: number) => {
        if (!book.id) return;

        setUpdatingStatus(true);

        try {
            await updateBookStatus(book.id, newStatus);

            // Success toast
            toast.success(
                newStatus === 1
                    ? "Book has been unsuspended successfully"
                    : "Book has been suspended successfully"
            );

            window.location.reload(); // Quick fix, or better: update local state
        } catch (error: any) {
            console.error("Failed to update book status:", error);

            // Handle different types of errors
            if (error.response?.status === 422) {
                // Validation error - book has active borrow events
                const errorMessage =
                    error.response.data?.message ||
                    "Cannot suspend this book because it is currently being borrowed or has active borrow requests.";

                toast.error("Cannot Suspend Book", {
                    description: errorMessage,
                    duration: 5000, // Show longer for important errors
                });
            } else if (error.response?.status === 404) {
                toast.error("Book not found");
            } else if (error.response?.status >= 500) {
                toast.error("Server error occurred. Please try again later.");
            } else {
                toast.error("Failed to update book status. Please try again.");
            }
        } finally {
            setUpdatingStatus(false);
            setOpenDropdown(null);
        }
    };

    const getAvailabilityBadge = (availability?: BookAvailability) => {
        const availabilityId = availability?.availability_id;
        switch (availabilityId) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                        Available
                    </span>
                );
            case 2:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
                        Unavailable
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                        Unknown
                    </span>
                );
        }
    };

    const getStatusBadge = (status?: number) => {
        switch (status) {
            case 1:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                        Unsuspended
                    </span>
                );
            case 0:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-1.5"></div>
                        Suspended
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></div>
                        Unknown
                    </span>
                );
        }
    };

    const renderGenreTags = (genres?: Genre[]) => {
        if (!genres || genres.length === 0) return null;

        const visibleGenres = genres.slice(0, 3);
        const hiddenCount = genres.length - 3;

        return (
            <div className="flex flex-wrap gap-1">
                {visibleGenres.map((genre) => (
                    <span
                        key={genre.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                        {genre.genre}
                    </span>
                ))}
                {hiddenCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        +{hiddenCount} more
                    </span>
                )}
            </div>
        );
    };

    const handleActionClick = (
        e: React.MouseEvent,
        action: string,
        book: Book
    ) => {
        e.stopPropagation();
        console.log(`${action} book:`, book);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (books.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No books found
                </h3>
                <p className="text-gray-500">
                    Try adjusting your search or filter criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="">
            {/* Desktop Table */}
            <div className="hidden lg:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Book
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Genre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Availability
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Uploaded On
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {books.map((book) => (
                            <tr
                                key={book.id}
                                onClick={() => onBookClick(book)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-16 w-12">
                                            {book.pictures &&
                                            book.pictures.length > 0 ? (
                                                <img
                                                    className="h-16 w-12 object-cover rounded-md border border-gray-200"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        book.pictures[0].picture
                                                    }
                                                    alt={
                                                        book.title ||
                                                        "Book cover"
                                                    }
                                                />
                                            ) : (
                                                <div className="h-16 w-12 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                                    <BookOpen className="h-6 w-6 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                                                {book.title || "Unknown Title"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                by{" "}
                                                {book.author ||
                                                    "Unknown Author"}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                ID: {book.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            {book.user!.picture ? (
                                                <img
                                                    className="h-8 w-8 rounded-full object-cover"
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        book.user!.picture
                                                    }
                                                    alt={
                                                        book.user!.name ||
                                                        "User"
                                                    }
                                                />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="h-4 w-4 text-gray-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {book.user!.name ||
                                                    "Unknown User"}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {renderGenreTags(book.genres)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getAvailabilityBadge(book.availability)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <div className="text-sm text-gray-900">
                                            {book.created_at
                                                ? formatDate(book.created_at)
                                                : "N/A"}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(book.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                router.push(
                                                    `dashboard/books/${book.id}`
                                                );
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4 cursor-pointer" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (book.id !== undefined) {
                                                        setOpenDropdown(
                                                            openDropdown ===
                                                                book.id
                                                                ? null
                                                                : book.id
                                                        );
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-50 transition-colors"
                                            >
                                                <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                            </button>
                                            {openDropdown === book.id && (
                                                <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border z-60 flex flex-col">
                                                    {/* <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleStatusUpdate(
                                                                book,
                                                                book.status ===
                                                                    1
                                                                    ? 0
                                                                    : 1
                                                            );
                                                        }}
                                                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                                                    >
                                                        {book.status === 1
                                                            ? "Suspend Book"
                                                            : "Unsuspend Book"}
                                                    </button> */}
                                                    <button
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                book,
                                                                book.status ===
                                                                    1
                                                                    ? 0
                                                                    : 1
                                                            )
                                                        }
                                                        disabled={
                                                            updatingStatus
                                                        }
                                                        className="cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {book.status === 1 ? (
                                                            <>
                                                                <p className="font-medium">
                                                                    {updatingStatus
                                                                        ? "Suspending..."
                                                                        : "Suspend Book"}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <p className="font-medium">
                                                                    {updatingStatus
                                                                        ? "Unsuspending..."
                                                                        : "Unsuspend Book"}
                                                                </p>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
                {books.map((book) => (
                    <div
                        key={book.id}
                        onClick={() => onBookClick(book)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                        <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                                {book.pictures && book.pictures.length > 0 ? (
                                    <img
                                        className="h-20 w-15 object-cover rounded-md border border-gray-200"
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            book.pictures[0].picture
                                        }
                                        alt={book.title || "Book cover"}
                                    />
                                ) : (
                                    <div className="h-20 w-15 bg-gray-200 rounded-md flex items-center justify-center border border-gray-200">
                                        <BookOpen className="h-8 w-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {book.title || "Unknown Title"}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate">
                                            by {book.author || "Unknown Author"}
                                        </div>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <div className="flex items-center">
                                                {book.user!.picture ? (
                                                    <img
                                                        className="h-5 w-5 rounded-full object-cover"
                                                        src={
                                                            process.env
                                                                .NEXT_PUBLIC_IMAGE_PATH +
                                                            book.user!.picture
                                                        }
                                                        alt={
                                                            book.user!.name ||
                                                            "User"
                                                        }
                                                    />
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                                                        <User className="h-3 w-3 text-gray-600" />
                                                    </div>
                                                )}
                                                <span className="ml-1 text-xs text-gray-500">
                                                    {book.user!.name}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            {renderGenreTags(book.genres)}
                                        </div>
                                        <div className="flex items-center mt-2 space-x-3">
                                            {getAvailabilityBadge(
                                                book.availability
                                            )}
                                            {getStatusBadge(book.status)}
                                            <div className="text-xs text-gray-500">
                                                {book.created_at
                                                    ? formatDate(
                                                          book.created_at
                                                      )
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex flex-col">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBookClick(book);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                                            title="View Book Details"
                                        >
                                            <Eye className="w-4 h-4 cursor-pointer" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (book.id !== undefined) {
                                                    setOpenDropdown(
                                                        openDropdown === book.id
                                                            ? null
                                                            : book.id
                                                    );
                                                }
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                                        </button>
                                        {openDropdown === book.id && (
                                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border z-60 flex flex-col">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStatusUpdate(
                                                            book,
                                                            book.status === 1
                                                                ? 0
                                                                : 1
                                                        );
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 cursor-pointer"
                                                >
                                                    {book.status === 1
                                                        ? "Suspend Book"
                                                        : "Unsuspend Book"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
