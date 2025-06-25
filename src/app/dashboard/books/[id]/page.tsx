"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    MoreHorizontal,
    User,
    Calendar,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
} from "lucide-react";

// Components
import BookImageGallery from "../components/BookImageGallery";
import BookInfoCard from "../components/BookInfoCard";
import BookOwnerCard from "../components/BookOwnerCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Book } from "@/app/types/admin";
import { fetchBookbyId, updateBookStatus } from "@/lib/api/books";

export default function BookDetailPage() {
    const { id } = useParams();
    const bookId = parseInt(id as string);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(false);

    const fetchBookData = async () => {
        setLoading(true);
        try {
            const response = await fetchBookbyId(bookId.toString());
            if (response.success) {
                setBook(response.data);
            } else {
                console.error("Failed to fetch book data:", response.message);
                setBook(null);
            }
        } catch (error) {
            console.error("Error fetching book data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookData();
    }, []);

    const handleStatusUpdate = async (book: Book, newStatus: number) => {
        try {
            await updateBookStatus(book.id!, newStatus);
            window.location.reload(); // Quick fix, or better: update local state
        } catch (error) {
            console.error("Failed to update book status:", error);
        }
        setOpenDropdown(false);
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Book Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The book you're looking for doesn't exist.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Books
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Book Details
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage book information
                            </p>
                        </div>
                    </div>

                    {/* Actions Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setOpenDropdown(!openDropdown)}
                            className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <h1 className="mr-2"> Actions</h1>
                            <MoreHorizontal className="w-4 h-4 " />
                        </button>

                        {openDropdown && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                                <button
                                    onClick={() =>
                                        handleStatusUpdate(
                                            book,
                                            book.status === 1 ? 0 : 1
                                        )
                                    }
                                    className="cursor-pointer w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                                >
                                    {book.status === 1 ? (
                                        <>
                                            <p className="font-medium">
                                                Suspend Book
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium">
                                                Unsuspend Book
                                            </p>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Image Gallery */}
                <div className="lg:col-span-1">
                    <BookImageGallery
                        pictures={book.pictures || []}
                        title={book.title}
                    />
                </div>

                {/* Middle Column - Book Information */}
                <div className="lg:col-span-1">
                    <BookInfoCard book={book} />
                </div>

                {/* Right Column - Owner Information & Availability */}
                <div className="lg:col-span-1">
                    <BookOwnerCard
                        user={book.user}
                        availability={book.availability}
                    />
                </div>
            </div>
        </div>
    );
}
