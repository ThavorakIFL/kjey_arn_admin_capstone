import React from "react";
import { BookOpen, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
interface Book {
    id?: number;
    title?: string;
    author?: string;
    pictures?: Picture[];
}

interface Picture {
    id: number;
    picture: string;
}

interface BorrowActivityBookCardProps {
    book?: Book;
}

export default function BorrowActivityBookCard({
    book,
}: BorrowActivityBookCardProps) {
    const router = useRouter();
    const handleViewBookDetails = () => {
        router.push(`/dashboard/books/${book?.id}`);
    };

    if (!book) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                        Book information not available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Book Image */}
            <div className="aspect-[3/4] bg-gray-100 relative">
                {book.pictures && book.pictures.length > 0 ? (
                    <img
                        src={
                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                            book.pictures[0].picture
                        }
                        alt={book.title || "Book cover"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                )}

                {/* Overlay with book info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                        {book.title || "Unknown Title"}
                    </h3>
                    <p className="text-white/80 text-sm">
                        by {book.author || "Unknown Author"}
                    </p>
                </div>
            </div>

            {/* Book Actions */}
            <div className="p-4">
                <button
                    onClick={handleViewBookDetails}
                    className="cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Eye className="w-4 h-4 mr-2 " />
                    View Book Details
                </button>

                <div className="mt-3 text-center">
                    <p className="text-sm text-gray-500">Book ID: #{book.id}</p>
                </div>
            </div>
        </div>
    );
}
