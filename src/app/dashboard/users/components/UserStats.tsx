// components/book/UserStatas.tsx
import { Book, BookOpen, BookX } from "lucide-react";

interface UserStatasProps {
    totalBooks?: number;
    availableBooks?: number;
    unavailableBooks?: number;
}

export default function UserStatas({
    totalBooks,
    availableBooks,
    unavailableBooks,
}: UserStatasProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Books */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Books</p>
                        <p className="text-2xl font-semibold text-gray-900">
                            {totalBooks}
                        </p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <Book className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Available Books */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Available Books</p>
                        <p className="text-2xl font-semibold text-green-600">
                            {availableBooks}
                        </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Unavailable Books */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">
                            Unavailable Books
                        </p>
                        <p className="text-2xl font-semibold text-red-600">
                            {unavailableBooks}
                        </p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                        <BookX className="h-6 w-6 text-red-600" />
                    </div>
                </div>
            </div>
        </div>
    );
}
