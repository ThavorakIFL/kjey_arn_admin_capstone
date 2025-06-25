import { BorrowEventReport } from "@/lib/api/report";

export interface DashboardStats {
    total_users: number;
    total_books: number;
}

export interface Admin {
    id: number;
    username: string;
    super_admin: number;
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
    sub?: string; // Add this
    picture?: string;
    bio?: string; // Add this
    books_count?: number;
    status?: number;
    created_at?: string; // Add this
    updated_at?: string; // Add this
}
export interface Genre {
    id?: number;
    genre?: string;
    created_at?: string; // Add this
    updated_at?: string; // Add this
    pivot?: {
        // Add this for book-genre relationship
        book_id: number;
        genre_id: number;
    };
}

export interface Picture {
    id: number;
    book_id?: number; // Add this
    picture: string;
    order?: number; // Add this
    created_at?: string; // Add this
    updated_at?: string; // Add this
}

export interface Availability {
    id: number;
    availability: string;
}

export interface BookAvailability {
    id: number;
    book_id: number;
    availability_id: number;
    availability: Availability; // The related availability record
}

export interface Book {
    id?: number;
    user_id?: number; // Add this
    title?: string;
    author?: string;
    condition?: number; // Change to number (your response shows 100)
    description?: string;
    status?: number;
    created_at?: string;
    updated_at?: string;
    pictures?: Picture[];
    genres?: Genre[];
    availability?: BookAvailability;
    user?: User; // Make optional since not always loaded
}

export interface BorrowActivity {
    id: number;
    created_at: string;
    updated_at: string;
    borrower: User; // Add this
    lender: User;
    book: Book;
    borrow_status: BorrowEventBorrowStatus; // Fix this name
    meet_up_detail?: MeetUpDetail; // Add this (snake_case)
    return_detail?: ReturnDetail; // Add this (snake_case)
    borrow_event_reject_reason?: any; // Add this
    borrow_event_cancel_reason?: any; // Add this
    borrow_event_report?: BorrowEventReport; // Add this
    borrower_id?: number;
    lender_id?: number;
    book_id?: number;
}

export interface BorrowEventBorrowStatus {
    id: number;
    borrow_event_id: number;
    borrow_status_id: number;
    created_at?: string;
    updated_at?: string;
    borrow_status: BorrowStatusDetail; // Fix this name
}
export interface BorrowStatusDetail {
    // Rename from BorrowStatus
    id: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}
export interface MeetUpDetail {
    id: number;
    borrow_event_id: number;
    start_date: string;
    end_date: string;
    final_time?: string;
    final_location?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ReturnDetail {
    id: number;
    borrow_event_id: number;
    return_date: string;
    return_time?: string;
    return_location?: string;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: number;
    location: string;
    created_at: string;
    updated_at: string;
}
