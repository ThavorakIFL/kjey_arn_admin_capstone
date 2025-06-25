import api from "@/lib/api/api";
import { Book, BorrowActivity, User } from "../types/admin";

export class UserService {
    static async getAllUsers(): Promise<User[]> {
        const response = await api.get<User[]>("/admin/all-users");
        return response.data;
    }

    static async getUserById(id: string): Promise<User> {
        const response = await api.get<User>(`/admin/get-user/${id}`);
        return response.data;
    }

    static async getUserBookById(id: string): Promise<Book[]> {
        const response = await api.get<Book[]>(`/admin/get-user/${id}/books`);
        return response.data;
    }

    static async getUserBorrowDataById(id: string): Promise<BorrowActivity[]> {
        const response = await api.get<BorrowActivity[]>(
            `/admin/get-user/${id}/borrow-events`
        );
        console.log("User borrow data response:", response.data);
        return response.data;
    }
}
