import { BorrowActivity, BorrowStatusDetail } from "@/app/types/admin";
import api from "@/lib/api/api"; // Your configured axios instance

interface BorrowActivitiesApiParams {
    search?: string;
    status?: string;
    date_filter?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    per_page?: number;
}

interface BorrowActivitiesApiResponse {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
        activities: BorrowActivity[];
        filter_counts: {
            all: number;
            pending: number;
            accepted: number;
            rejected: number;
            in_progress: number;
            completed: number;
            cancelled: number;
        };
    };
}

interface BorrowActivitiybyIdApiResponse {
    success: boolean;
    message: string;
    data: BorrowActivity;
}

interface BorrowStatusesApiResponse {
    success: boolean;
    message: string;
    data: BorrowStatusDetail[];
}
// Fetch borrow activities with filters
export const fetchBorrowActivities = async (
    params: BorrowActivitiesApiParams
): Promise<BorrowActivitiesApiResponse> => {
    const response = await api.get("/admin/borrow-activities", { params });
    return response.data;
};

// Fetch all borrow statuses
export const fetchBorrowStatuses =
    async (): Promise<BorrowStatusesApiResponse> => {
        const response = await api.get("/admin/borrow-statuses");
        return response.data;
    };

export const fetchBorrowActivityById = async (
    activityId: string
): Promise<BorrowActivitiybyIdApiResponse> => {
    const response = await api.get(`/admin/borrow-activities/${activityId}`);
    return response.data;
};
