import { GenreStats } from "@/components/DonutChart"; // Adjust path as needed

export interface PopularGenre {
    id: number;
    genre: string;
    books_count: number;
}

// Genre color mapping - could also be moved to a constants file
export const GENRE_COLORS: { [key: string]: string } = {
    Horror: "#EF4444",
    Romance: "#EC4899",
    Adventure: "#F59E0B",
    "Science Fiction": "#3B82F6",
    Fantasy: "#8B5CF6",
    Mystery: "#6B7280",
    Thriller: "#10B981",
    "Historical Fiction": "#F97316",
    Biography: "#84CC16",
    "Self-Help": "#06B6D4",
    Philosophy: "#8B5CF6",
    Poetry: "#F43F5E",
    "Young Adult": "#A855F7",
    "Children's": "#22D3EE",
    Dystopian: "#EF4444",
    "Non-Fiction": "#6366F1",
    Memoir: "#F59E0B",
    Crime: "#DC2626",
    Classic: "#059669",
    "Comic Book/Graphic Novel": "#7C3AED",
};

export const DEFAULT_GENRE_COLOR = "#6B7280";

/**
 * Transforms API genre data to format expected by DonutChart component
 * @param apiData - Array of PopularGenre from API
 * @returns Array of GenreStats for the chart component
 */
export const transformToGenreStats = (
    apiData: PopularGenre[]
): GenreStats[] => {
    return apiData.map((item) => ({
        genre: item.genre,
        count: item.books_count,
        color: GENRE_COLORS[item.genre] || DEFAULT_GENRE_COLOR,
    }));
};

/**
 * Get color for a specific genre
 * @param genreName - Name of the genre
 * @returns Hex color string
 */
export const getGenreColor = (genreName: string): string => {
    return GENRE_COLORS[genreName] || DEFAULT_GENRE_COLOR;
};
