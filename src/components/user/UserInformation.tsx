// components/user/UserInformation.tsx
"use client";

import { User, Book, BorrowActivity } from "@/app/types/admin";
import UserProfile from "./UserProfile";
import UserBorrowActivity from "./UserBorrowActivity";
import UserBooks from "./UserBooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserInformationProps {
    userBorrowDatas?: BorrowActivity[];
    userBooks?: Book[];
    data: User;
}

export default function UserInformation({
    data,
    userBooks,
    userBorrowDatas,
}: UserInformationProps) {
    const router = useRouter();
    // Handlers for book actions
    const handleViewBook = (bookId: string) => {
        router.push(`/dashboard/books/${bookId}`);
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                User Details
                            </h1>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                ID: {data.id}
                            </span>
                        </div>

                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-gray-900 font-medium"
                        >
                            ← Back to Users
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Top Section - Profile and Borrow Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* User Profile */}
                        <div>
                            <UserProfile user={data} />
                        </div>

                        {/* Borrow Activity */}
                        <div>
                            <UserBorrowActivity
                                activities={userBorrowDatas || []}
                            />
                        </div>
                    </div>

                    {/* Bottom Section - User's Books */}
                    <div>
                        <UserBooks
                            books={userBooks?.map((book) => book) || []}
                            onViewBook={handleViewBook}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
