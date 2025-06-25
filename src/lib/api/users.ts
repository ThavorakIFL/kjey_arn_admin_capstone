import { Book, BorrowActivity, User } from "@/app/types/admin";
import api from "./api";

interface UsersApiParams {
    search?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

interface BooksApiParams {
    search?: string;
    availability?: string;
    genre?: string;
    status?: string;
    page?: number;
    per_page?: number;
}

interface UsersApiResponse {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
        users: User[];
        filter_counts: {
            all: number;
            active: number;
            suspended: number;
        };
    };
}

interface UserBooksbyIdResponse {
    success: boolean;
    message: string;
    data: {
        books: Book[];
        pagination: any;
        filter_counts: any;
    };
}

export const fetchUsers = async (
    params: UsersApiParams
): Promise<UsersApiResponse> => {
    const response = await api.get("/admin/users", { params });
    return response.data;
};

export const fetchTotalUsers = async (): Promise<{
    success: boolean;
    data: number;
    message: string;
}> => {
    const response = await api.get("/admin/users/total");
    return response.data;
};

export const updateUserStatus = async (userId: number, status: number) => {
    const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
    });
    return response.data;
};

export const fetchUserbyId = async (
    userId: string
): Promise<{ success: boolean; data: User; message: string }> => {
    const response = await api.get(`/admin/users/user/${userId}`);
    return response.data;
};

export const fetchUserBooksbyId = async (
    userId: string,
    parameter?: BooksApiParams
): Promise<UserBooksbyIdResponse> => {
    const response = await api.get(`/admin/users/books/${userId}`, {
        params: parameter,
    });
    return response.data;
};

export const fetchUserBorrowActivitiesbyId = async (
    userId: string
): Promise<{ success: boolean; data: BorrowActivity[]; message: string }> => {
    const response = await api.get(`/admin/users/borrows/${userId}`);
    return response.data;
};
