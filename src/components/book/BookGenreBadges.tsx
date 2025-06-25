// components/book/BookGenreBadges.tsx
import { Badge } from "@/components/ui/badge";
import { Genre } from "@/app/types/admin";

interface BookGenreBadgesProps {
    genres: Genre[];
    className?: string;
}

const getGenreBadgeColor = (genre: string) => {
    const colorOptions = [
        "bg-blue-100 text-blue-800 border-blue-200",
        "bg-purple-100 text-purple-800 border-purple-200",
        "bg-indigo-100 text-indigo-800 border-indigo-200",
        "bg-pink-100 text-pink-800 border-pink-200",
        "bg-red-100 text-red-800 border-red-200",
        "bg-cyan-100 text-cyan-800 border-cyan-200",
        "bg-orange-100 text-orange-800 border-orange-200",
        "bg-yellow-100 text-yellow-800 border-yellow-200",
        "bg-green-100 text-green-800 border-green-200",
        "bg-emerald-100 text-emerald-800 border-emerald-200",
    ];

    // Generate a consistent color for the same genre name
    const index = Math.abs(
        genre.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
            colorOptions.length
    );
    return genre === "Unknown"
        ? "bg-gray-100 text-gray-800 border-gray-200"
        : colorOptions[index];
};

export default function BookGenreBadges({
    genres,
    className = "",
}: BookGenreBadgesProps) {
    if (!genres || genres.length === 0) {
        return (
            <div className={`${className}`}>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Genre
                </h3>
                <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 border-gray-200"
                >
                    Unknown
                </Badge>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Genre</h3>
            <div className="flex flex-wrap gap-2">
                {genres.map((genre, index) => (
                    <Badge
                        key={genre.id || index}
                        variant="outline"
                        className={`${getGenreBadgeColor(
                            genre.genre || "Unknown"
                        )}`}
                    >
                        {genre.genre || "Unknown"}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
