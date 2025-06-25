import BookContent from "@/components/book/BookContent";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
export default function BooksPage() {
    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="bg-white border-b border-gray-200/60">
                <div className="px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            All Books
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
            <div className="px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Book Management
                                </h2>
                                <p className="text-gray-600">
                                    Manage and monitor all listed books in your
                                    system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Content */}
                    <BookContent />
                </div>
            </div>
        </div>
    );
}
