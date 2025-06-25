import { BookAvailability, Genre, Picture } from "@/app/types/admin";
import api from "@/lib/api/api";

export interface BorrowEventReport {
    id: number;
    borrow_event_id: number;
    reported_by: number;
    reason: string;
    status: number;
    created_at: string;
    updated_at: string;
    reporter?: User;
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

export interface User {
    id: number;
    name: string;
    email: string;
    sub: string;
    picture: string;
    bio: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface ReportedBorrowEvent {
    id: number;
    borrower_id: number;
    lender_id: number;
    book_id: number;
    created_at: string;
    updated_at: string;
    borrow_event_report: BorrowEventReport;
    book: Book;
    borrower: User;
    lender: User;
}

// API Response wrapper
export interface ReportsApiResponse {
    success: boolean;
    message: string;
    data: ReportedBorrowEvent[];
}

// Optional: Additional interfaces for filtering/pagination if needed
export interface ReportsQueryParams {
    page?: number;
    per_page?: number;
    search?: string;
    status?: number; // Filter by report status
    date_from?: string;
    date_to?: string;
}

// API function
export const fetchReportedBorrowActivities = async (
    params?: ReportsQueryParams
): Promise<ReportsApiResponse> => {
    try {
        const response = await api.get<ReportsApiResponse>(
            "/admin/reports/borrow-activities",
            {
                params,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching reported borrow activities:", error);
        throw error;
    }
};

export const confirmBookDeposit = async (
    bookId: number
): Promise<{
    success: boolean;
    message: string;
}> => {
    const response = await api.patch(
        `/admin/reports/borrow-activities/${bookId}/status`
    );
    return response.data;
};
