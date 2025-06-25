import api from "@/lib/api/api";
import {
    DashboardStats,
    Admin,
    LoginResponse,
    User,
    Book,
} from "../types/admin";

export class AdminService {
    static async login(credentials: {
        username: string;
        password: string;
    }): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>(
            "/admin/login",
            credentials
        );
        return response.data;
    }

    static async getMe(): Promise<Admin> {
        const response = await api.get<Admin>("/admin/check");
        return response.data;
    }

    static async logout(): Promise<void> {
        await api.post("/admin/logout");
    }
}
