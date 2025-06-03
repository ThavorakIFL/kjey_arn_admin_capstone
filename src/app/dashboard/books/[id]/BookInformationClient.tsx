"use client";

import BookInformation from "@/components/book/BookInformation";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useBookById } from "@/hooks/useBookData";

interface BookInformationClientProps {
    bookId: string;
}

export default function BookInformationClient({
    bookId,
}: BookInformationClientProps) {
    const { data: book, loading, error } = useBookById(bookId);
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) return <ErrorMessage message={error} />;
    if (!book) {
        return <div>No data available</div>;
    }

    return <BookInformation data={book} />;
}
