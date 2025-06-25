import { Book, Genre } from "@/app/types/admin";
import api from "./api";

interface BooksApiParams {
    search?: string;
    availability?: string;
    genre?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

interface BooksApiResponse {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
        books: Book[];
        filter_counts: {
            all: number;
            available: number;
            unavailable: number;
            active: number;
            suspended: number;
        };
    };
}

interface BookByIdResponse {
    success: boolean;
    message: string;
    data: Book;
}

interface GenresApiResponse {
    success: boolean;
    message: string;
    data: Genre[];
}

export const fetchBooks = async (
    params: BooksApiParams
): Promise<BooksApiResponse> => {
    const response = await api.get("/admin/books", { params });
    return response.data;
};

export const fetchTotalBooks = async (): Promise<{
    success: boolean;
    data: number;
    message: string;
}> => {
    const response = await api.get("/admin/books/total");
    return response.data;
};

export const fetchGenres = async (): Promise<GenresApiResponse> => {
    const response = await api.get("/admin/genres");
    return response.data;
};

export const fetchBookbyId = async (
    bookId: string
): Promise<BookByIdResponse> => {
    const response = await api.get(`/admin/books/${bookId}`);
    return response.data;
};

export const updateBookStatus = async (bookId: number, status: number) => {
    const response = await api.patch(`/admin/books/${bookId}/status`, {
        status,
    });
    return response.data;
};
