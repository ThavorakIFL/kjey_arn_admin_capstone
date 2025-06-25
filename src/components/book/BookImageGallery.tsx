// components/book/BookImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Picture } from "@/app/types/admin";

interface BookImageGalleryProps {
    pictures: Picture[];
    bookTitle: string;
    className?: string;
}

export default function BookImageGallery({
    pictures,
    bookTitle,
    className = "",
}: BookImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // If no pictures, show placeholder
    if (!pictures || pictures.length === 0) {
        return (
            <div className={`${className}`}>
                <div className="flex gap-4">
                    {/* Thumbnail column */}
                    <div className="flex flex-col gap-2 w-20">
                        <div className="w-20 h-28 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                                No Image
                            </span>
                        </div>
                    </div>

                    {/* Main image */}
                    <div className="flex-1 max-w-md">
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">
                                No Image Available
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const selectedPicture = pictures[selectedImageIndex];

    return (
        <div className={`${className}`}>
            <div className="flex gap-4">
                {pictures.length > 1 && (
                    <div className="hidden sm:flex flex-col gap-2 w-20">
                        {pictures.map((picture, index) => (
                            <button
                                key={picture.id || index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`relative w-20 h-28 rounded-lg overflow-hidden border-2 transition-all ${
                                    index === selectedImageIndex
                                        ? "border-blue-500 ring-2 ring-blue-200"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <Image
                                    src={
                                        process.env.NEXT_PUBLIC_IMAGE_PATH +
                                        picture.picture
                                    }
                                    alt={`${bookTitle} - Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="80px"
                                />
                            </button>
                        ))}
                    </div>
                )}

                {/* Main image */}
                <div className="flex-1 max-w-md">
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-blue-400 bg-white shadow-lg">
                        <Image
                            src={
                                process.env.NEXT_PUBLIC_IMAGE_PATH +
                                selectedPicture.picture
                            }
                            alt={bookTitle}
                            fill
                            className="object-fit"
                            sizes="(max-width: 768px) 100vw, 400px"
                            priority
                        />
                    </div>

                    {/* Mobile thumbnail navigation */}
                    {pictures.length > 1 && (
                        <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-2">
                            {pictures.map((picture, index) => (
                                <button
                                    key={picture.id || index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`relative flex-shrink-0 w-16 h-20 rounded-md overflow-hidden border transition-all ${
                                        index === selectedImageIndex
                                            ? "border-blue-500 ring-1 ring-blue-200"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <Image
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            picture.picture
                                        }
                                        alt={`${bookTitle} - Image ${
                                            index + 1
                                        }`}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
