"use client";

import { useBookData } from "@/hooks/useBookData";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import ErrorMessage from "../ErrorMessage";

export default function BookContent() {
    const { data: data, loading, error } = useBookData();
    const router = useRouter();
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) return <ErrorMessage message={error} />;
    if (!data) {
        return <div>No data available</div>;
    }
    return (
        <div className="max-w-4xl py-12">
            <h1 className="text-3xl font-bold mbb-8">Books</h1>
            {data.length > 0 ? (
                <ul className="space-y-4">
                    {data.map((book, index) => (
                        <div
                            onClick={() => {
                                router.push(`/dashboard/books/${book.id}`);
                            }}
                            key={index}
                            className="cursor-pointer flex items-center space-x-4"
                        >
                            <img
                                className="w-32 h-32 object-contain mb-4"
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                    book.pictures![0].picture
                                }
                            />
                            <li
                                key={index}
                                className="p-4 border rounded shadow"
                            >
                                <h2 className="text-xl font-semibold">
                                    {book.title}
                                </h2>
                                <p>Published: {book.description}</p>
                            </li>
                        </div>
                    ))}
                </ul>
            ) : (
                <div>No books available</div>
            )}
        </div>
    );
}
