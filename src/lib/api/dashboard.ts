import { BorrowActivityStats } from "@/components/BorrowActivityChart";
import api from "./api";
import { PopularGenre } from "@/utils/genreHelper";

interface DashboardApiResponse {
    success: boolean;
    message: string;
    data: DashboardStats;
}

interface DashboardBorrowEvent {
    success: boolean;
    message: string;
    data: DashboardBorrowEventStatusCount[];
}

interface PopularGenresResponse {
    success: boolean;
    message: string;
    data: PopularGenre[];
}

export const fetchDashboardStats = async (): Promise<DashboardApiResponse> => {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
};

export const fetchDashboardBorrowEvent =
    async (): Promise<DashboardBorrowEvent> => {
        const response = await api.get("/admin/dashboard/borrow-activities");
        return response.data;
    };

export const transformToBorrowActivityStats = (
    apiData: DashboardBorrowEventStatusCount[]
): { data: BorrowActivityStats[]; totalActivities: number } => {
    const totalActivities = apiData.reduce((sum, item) => sum + item.count, 0);

    const data = apiData.map((item) => ({
        status: item.status,
        count: item.count,
        percentage:
            totalActivities > 0 ? (item.count / totalActivities) * 100 : 0,
        trend: undefined as "up" | "down" | "stable" | undefined,
        trendValue: undefined as number | undefined,
    }));

    return { data, totalActivities };
};

export const fetchPopularGenres = async (): Promise<PopularGenresResponse> => {
    const response = await api.get("/admin/genres/popular-genres");
    return response.data;
};
