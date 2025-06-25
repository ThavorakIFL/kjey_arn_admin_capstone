// components/user/UserBooks.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { Book } from "@/app/types/admin";

// Type for user's books

interface UserBooksProps {
    books: Book[];
    onViewBook?: (bookId: string) => void;
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
    };
    return (
        colors[genre as keyof typeof colors] ||
        "bg-gray-100 text-gray-800 border-gray-200"
    );
};

export default function UserBooks({ books, onViewBook }: UserBooksProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    User's Books
                </CardTitle>
            </CardHeader>
            <CardContent>
                {books.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No books uploaded yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                        Book
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                        Genre
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                        Availability
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                        Uploaded On
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">
                                        Status
                                    </th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {books.map((book) => (
                                    <tr
                                        key={book.id}
                                        className="hover:bg-gray-50 transition-colors group"
                                    >
                                        {/* Book */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="relative h-12 w-9 rounded-md overflow-hidden bg-gray-200">
                                                        <Image
                                                            src={
                                                                process.env
                                                                    .NEXT_PUBLIC_IMAGE_PATH! +
                                                                book.pictures![0]
                                                                    .picture
                                                            }
                                                            alt={
                                                                book.title || ""
                                                            }
                                                            fill
                                                            className="object-cover"
                                                            sizes="36px"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {book.title}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Genre */}
                                        <td className="py-4 px-4">
                                            <div className="flex flex-wrap gap-1">
                                                {book.genres!.map(
                                                    (genre, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="outline"
                                                            className={`text-xs ${getGenreBadgeColor(
                                                                genre.genre ||
                                                                    ""
                                                            )}`}
                                                        >
                                                            {genre.genre || ""}
                                                        </Badge>
                                                    )
                                                )}
                                                {book.genres!.length > 3 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        +
                                                        {book.genres!.length -
                                                            3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>

                                        {/* Availability */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        book.availability
                                                            ?.availability_id ===
                                                        1
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></div>
                                                <span
                                                    className={`text-sm font-medium ${
                                                        book.availability
                                                            ?.availability_id ===
                                                        1
                                                            ? "text-green-700"
                                                            : "text-red-700"
                                                    }`}
                                                >
                                                    {book.availability
                                                        ?.availability_id === 1
                                                        ? "Available"
                                                        : "Not Available"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Uploaded On */}
                                        <td className="py-4 px-4">
                                            <span className="text-sm text-gray-700">
                                                {book.created_at
                                                    ? format(
                                                          new Date(
                                                              book.created_at
                                                          ),
                                                          "MMMM dd, yyyy"
                                                      )
                                                    : "N/A"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`h-2 w-2 rounded-full ${
                                                        book.status === 1
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs font-medium ${
                                                        book.status === 1
                                                            ? "text-green-700 border-green-200 bg-green-50"
                                                            : "text-red-700 border-red-200 bg-red-50"
                                                    }`}
                                                >
                                                    {book.status === 0
                                                        ? "Unsuspended"
                                                        : "Suspended"}
                                                </Badge>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-48"
                                                >
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            onViewBook?.(
                                                                book.id!.toString()
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
