import api from "@/lib/api";
import { User } from "../types/admin";

export class UserService {
    static async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>("/admin/all-users");
        return response.data;
    }

    static async getUserById(id: string): Promise<User> {
        const response = await api.get<User>(`/admin/get-user/${id}`);
        return response.data;
    }
}
