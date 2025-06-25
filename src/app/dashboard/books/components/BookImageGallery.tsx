import React, { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

interface Picture {
    id: number;
    picture: string;
    order?: number;
}

interface BookImageGalleryProps {
    pictures: Picture[];
    title?: string;
}

export default function BookImageGallery({
    pictures,
    title,
}: BookImageGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Sort pictures by order if available
    const sortedPictures = pictures.sort(
        (a, b) => (a.order || 0) - (b.order || 0)
    );

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? sortedPictures.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === sortedPictures.length - 1 ? 0 : prev + 1
        );
    };

    if (sortedPictures.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No images available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Main Image Display */}
            <div className="relative">
                <div className="aspect-[3/4] bg-gray-100">
                    <img
                        src={
                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                            sortedPictures[selectedImageIndex].picture
                        }
                        alt={title || "Book cover"}
                        className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows (only show if multiple images) */}
                    {sortedPictures.length > 1 && (
                        <>
                            <button
                                onClick={handlePreviousImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {sortedPictures.length > 1 && (
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                            {selectedImageIndex + 1} / {sortedPictures.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Navigation (only show if multiple images) */}
            {sortedPictures.length > 1 && (
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                        {sortedPictures.map((picture, index) => (
                            <button
                                key={picture.id}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`aspect-[3/4] rounded-md overflow-hidden border-2 transition-colors ${
                                    index === selectedImageIndex
                                        ? "border-blue-500"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <img
                                    src={
                                        process.env.NEXT_PUBLIC_IMAGE_PATH +
                                        picture.picture
                                    }
                                    alt={`${title || "Book"} - Image ${
                                        index + 1
                                    }`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
