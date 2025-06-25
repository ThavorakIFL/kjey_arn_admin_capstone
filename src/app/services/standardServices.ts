import api from "@/lib/api/api";
import { DashboardStats } from "../types/admin";

export class StandardService {
    static async getDashboardStats(): Promise<DashboardStats> {
        const response = await api.get<DashboardStats>(
            "/admin/all-data-number"
        );
        return response.data;
    }
}
