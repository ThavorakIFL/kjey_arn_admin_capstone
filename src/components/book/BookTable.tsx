// components/book/BookTable.tsx - Fixed for original pattern + genre
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Filter,
    X,
    Book,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminSearch } from "@/components/AdminSearch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { toast } from "sonner";
import { Book as BookType } from "@/app/types/admin";
import { GenreFilter } from "@/components/GenreFilter";

interface BookTableProps {
    books: BookType[];
    loading?: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onFilterChange?: (filters: Record<string, string>) => void;
    currentFilters?: Record<string, string>;
}

const getGenreBadgeColor = (genre: string) => {
    const colors = {
        Adventure: "bg-blue-100 text-blue-800 border-blue-200",
        Magic: "bg-purple-100 text-purple-800 border-purple-200",
        Fantasy: "bg-indigo-100 text-indigo-800 border-indigo-200",
        Romance: "bg-pink-100 text-pink-800 border-pink-200",
        Mystery: "bg-gray-100 text-gray-800 border-gray-200",
        Thriller: "bg-red-100 text-red-800 border-red-200",
        "Science Fiction": "bg-cyan-100 text-cyan-800 border-cyan-200",
        Horror: "bg-orange-100 text-orange-800 border-orange-200",
        Drama: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Comedy: "bg-green-100 text-green-800 border-green-200",
    };
    return (
        colors[genre as keyof typeof colors] ||
        "bg-gray-100 text-gray-800 border-gray-200"
    );
};

export default function BookTable({
    books,
    loading = false,
    searchTerm,
    onSearchChange,
    onFilterChange,
    currentFilters = {},
}: BookTableProps) {
    const router = useRouter();

    // Get filter values from currentFilters prop (passed from parent)
    const availabilityFilter = currentFilters.availability || "all";
    const statusFilter = currentFilters.status || "all";
    const genreFilter = currentFilters.genre_id || "all";
    const sortBy = currentFilters.sort_by || "title";
    const sortOrder = (currentFilters.sort_order as "asc" | "desc") || "asc";

    // Handle individual filter changes - send single filter update to parent
    const handleFilterChange = (key: string, value: string) => {
        if (!onFilterChange) return;

        // Send only the changed filter to parent
        onFilterChange({ [key]: value });
    };

    // Clear all filters
    const clearFilters = () => {
        onFilterChange?.({
            availability: "all",
            status: "all",
            genre_id: "all",
            sort_by: "title",
            sort_order: "asc",
        });
    };

    const handleViewBook = (bookId: number) => {
        router.push(`/dashboard/books/${bookId}`);
    };

    const handleEditBook = (bookId: number) => {
        router.push(`/dashboard/books/${bookId}/edit`);
    };

    const handleDeleteBook = (bookId: number) => {
        // TODO: Implement delete functionality
        toast.error("Delete functionality not implemented yet");
        console.log("Delete book:", bookId);
    };

    // Check if any filters are active
    const hasActiveFilters =
        availabilityFilter !== "all" ||
        statusFilter !== "all" ||
        genreFilter !== "all" ||
        sortBy !== "title" ||
        sortOrder !== "asc";

    // Helper functions for your data structure
    const getBookCover = (book: BookType): string => {
        return book.pictures && book.pictures.length > 0
            ? process.env.NEXT_PUBLIC_IMAGE_PATH + book.pictures[0].picture
            : "/api/placeholder/200/300";
    };

    const getBookGenres = (book: BookType): string[] => {
        // Updated to work with your pivot table structure
        return book.genres?.map((g) => g.genre || "") || ["Unknown"];
    };

    const isBookAvailable = (book: BookType): boolean => {
        if (!book.availability) {
            return false; // No availability record = unavailable
        }

        // Check if availability_id is 1 (Available)
        return book.availability.availability_id === 1;
    };

    const isBookActive = (book: BookType): boolean => {
        // Your status: 1 = active/unsuspended, 0 = suspended
        return book.status === 1;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Search and Filters */}
            <div className="p-6 border-b space-y-4">
                {/* Search Bar */}
                <div className="flex gap-3">
                    <div className="flex-1">
                        <AdminSearch
                            searchTerm={searchTerm}
                            onSearchChange={onSearchChange}
                            placeholder="Search books by title, author, or ISBN..."
                            isSearching={loading}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                            Filters:
                        </span>
                    </div>

                    {/* Genre Filter */}
                    <GenreFilter
                        value={genreFilter}
                        onValueChange={(value) =>
                            handleFilterChange("genre_id", value)
                        }
                    />

                    {/* Availability Filter */}
                    <Select
                        value={availabilityFilter}
                        onValueChange={(value) =>
                            handleFilterChange("availability", value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Availability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Availability
                            </SelectItem>
                            <SelectItem value="1">Available</SelectItem>
                            <SelectItem value="2">Unavailable</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status Filter */}
                    <Select
                        value={statusFilter}
                        onValueChange={(value) =>
                            handleFilterChange("status", value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="1">Unsuspended</SelectItem>
                            <SelectItem value="0">Suspended</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort By */}
                    <Select
                        value={sortBy}
                        onValueChange={(value) =>
                            handleFilterChange("sort_by", value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="title">Title</SelectItem>
                            <SelectItem value="author">Author</SelectItem>
                            <SelectItem value="created_at">
                                Date Added
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Sort Order */}
                    <Select
                        value={sortOrder}
                        onValueChange={(value) =>
                            handleFilterChange("sort_order", value)
                        }
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                        </Button>
                    )}
                </div>

                {/* Results info */}
                {searchTerm && (
                    <p className="text-sm text-gray-600">
                        {books.length} books found for "{searchTerm}"
                    </p>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b">
                        <tr>
                            <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                Book
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                Owner
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                Genre
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                Availability
                            </th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700 text-sm">
                                Status
                            </th>
                            <th className="w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {books.map((book, index) => {
                            const bookCover = getBookCover(book);
                            const bookGenres = getBookGenres(book);
                            const isAvailable = isBookAvailable(book);
                            const isActive = isBookActive(book);

                            return (
                                <tr
                                    key={book.id || index}
                                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                    onClick={() =>
                                        book.id && handleViewBook(book.id)
                                    }
                                >
                                    {/* Book */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="relative h-12 w-9 rounded-md overflow-hidden bg-gray-200">
                                                    <Image
                                                        src={bookCover}
                                                        alt={
                                                            book.title ||
                                                            "Book cover"
                                                        }
                                                        fill
                                                        className="object-cover"
                                                        sizes="36px"
                                                    />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {book.title || "Untitled"}
                                                </p>
                                                <p className="text-sm text-gray-500 truncate">
                                                    {book.author ||
                                                        "Unknown Author"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Owner */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={
                                                        book.user?.picture
                                                            ? process.env
                                                                  .NEXT_PUBLIC_IMAGE_PATH +
                                                              book.user.picture
                                                            : undefined
                                                    }
                                                    alt={
                                                        book.user?.name ||
                                                        "User"
                                                    }
                                                />
                                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                                                    {book.user?.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-gray-900">
                                                {book.user?.name ||
                                                    "Unknown User"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Genre */}
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {bookGenres
                                                .slice(0, 3)
                                                .map((genre, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        variant="outline"
                                                        className={`text-xs ${getGenreBadgeColor(
                                                            genre
                                                        )}`}
                                                    >
                                                        {genre}
                                                    </Badge>
                                                ))}
                                            {bookGenres.length > 3 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    +{bookGenres.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </td>

                                    {/* Availability */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    isAvailable
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            ></div>
                                            <span
                                                className={`text-sm font-medium ${
                                                    isAvailable
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {isAvailable
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${
                                                    isActive
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            ></div>
                                            <span
                                                className={`text-sm font-medium ${
                                                    isActive
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {isActive
                                                    ? "Unsuspended"
                                                    : "Suspended"}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48"
                                            >
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        book.id &&
                                                            handleViewBook(
                                                                book.id
                                                            );
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        book.id &&
                                                            handleEditBook(
                                                                book.id
                                                            );
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit Book
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        book.id &&
                                                            handleDeleteBook(
                                                                book.id
                                                            );
                                                    }}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Book
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* No Results */}
            {!loading && books.length === 0 && (
                <div className="py-12 text-center">
                    <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? "No books found" : "No books yet"}
                    </h3>
                    <p className="text-gray-600">
                        {searchTerm
                            ? `No books match your search for "${searchTerm}".`
                            : "Get started by adding your first book to the system."}
                    </p>
                    {searchTerm && (
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => onSearchChange("")}
                        >
                            Clear search
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
