export interface DashboardStats {
    total_users: number;
    total_books: number;
}

export interface Admin {
    id: number;
    username: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface LoginResponse {
    admin: Admin;
    token: string;
}

export interface User {
    id?: number;
    name?: string;
    email?: string;
    picture?: string;
}

export interface Genre {
    id?: number;
    genre?: string;
}

export interface Picture {
    id: number;
    picture: string;
}

export interface Availablility {
    id: number;
    availability_id: number;
}

export interface Book {
    id?: number;
    author?: string;
    description?: string;
    title?: string;
    condition?: string;
    user: User;
    genres?: Genre[];
    pictures?: Picture[];
    availability?: Availablility[];
}
