// components/book/BookDetails.tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BookOwnerInfo from "./BookOwnerInfo";
import BookGenreBadges from "./BookGenreBadges";
import BookConditionBar from "./BookConditionBar";
import { Book } from "@/app/types/admin";

interface BookDetailsProps {
    book: Book;
    className?: string;
}

export default function BookDetails({
    book,
    className = "",
}: BookDetailsProps) {
    // Check if book is available
    const isAvailable = book.availability?.availability_id === 1;

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Title */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Title: {book.title || "Untitled Book"}
                </h1>
                {book.author && (
                    <p className="text-lg text-gray-600">by {book.author}</p>
                )}
            </div>

            {/* Owner and Genre Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Info */}
                <BookOwnerInfo owner={book.user} />

                {/* Genre */}
                <BookGenreBadges genres={book.genres || []} />
            </div>

            {/* Condition */}
            <BookConditionBar condition={book.condition} />

            {/* Description */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Description
                </h3>
                <Card className="bg-gray-50">
                    <CardContent className="p-4">
                        {book.description ? (
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {book.description}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">
                                No description available for this book.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Availability Status */}
            <div className="flex justify-end">
                <Badge
                    className={`px-4 py-2 text-sm font-medium ${
                        isAvailable
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                            : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                    }`}
                    variant="outline"
                >
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-2 w-2 rounded-full ${
                                isAvailable ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></div>
                        <span>
                            {isAvailable ? "Available" : "Not Available"}
                        </span>
                    </div>
                </Badge>
            </div>
        </div>
    );
}
