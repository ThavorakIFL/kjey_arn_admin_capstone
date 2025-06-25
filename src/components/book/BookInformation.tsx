// components/book/BookInformation.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Settings, ArrowLeft, Edit, Share2, Heart } from "lucide-react";
import BookImageGallery from "./BookImageGallery";
import BookDetails from "./BookDetailComponent";
import { Book } from "@/app/types/admin";

interface BookInformationProps {
    data: Book;
}

export default function BookInformation({ data }: BookInformationProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Kjey Arn
                        </h1>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            Admin Panel
                        </span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                            <AvatarImage
                                src="/api/placeholder/36/36"
                                alt="Profile"
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                                A
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Book Details
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Image Gallery */}
                        <div className="lg:sticky lg:top-8 lg:self-start">
                            <BookImageGallery
                                pictures={data.pictures || []}
                                bookTitle={data.title || "Book"}
                            />
                        </div>

                        {/* Right Column - Book Details */}
                        <div>
                            <BookDetails book={data} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
