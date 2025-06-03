import api from "@/lib/api";
import { Book } from "../types/admin";

export class BookService {
    static async getAllBooks(): Promise<Book[]> {
        const response = await api.get<Book[]>("/admin/all-books");
        return response.data;
    }

    static async getBookById(id: string): Promise<Book> {
        const response = await api.get<Book>(`/admin/get-book/${id}`);
        return response.data;
    }
}
