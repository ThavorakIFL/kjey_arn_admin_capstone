import api from "@/lib/api/api";
import { Genre } from "../types/admin";

export interface GenreResponse {
    data: Genre[];
    total: number;
}

export class GenreService {
    static async getGenres(): Promise<Genre[]> {
        try {
            const response = await api.get<GenreResponse>("/admin/genres");
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch genres:", error);
            // Return default genres matching the current database
            return [
                { id: 1, genre: "Horror" },
                { id: 2, genre: "Romance" },
                { id: 3, genre: "Adventure" },
                { id: 4, genre: "Science Fiction" },
                { id: 5, genre: "Fantasy" },
                { id: 6, genre: "Mystery" },
                { id: 7, genre: "Thriller" },
                { id: 8, genre: "Historical Fiction" },
                { id: 9, genre: "Biography" },
                { id: 10, genre: "Self-Help" },
                { id: 11, genre: "Philosophy" },
                { id: 12, genre: "Poetry" },
                { id: 13, genre: "Young Adult" },
                { id: 14, genre: "Children's" },
                { id: 15, genre: "Dystopian" },
                { id: 16, genre: "Non-Fiction" },
                { id: 17, genre: "Memoir" },
                { id: 18, genre: "Crime" },
                { id: 19, genre: "Classic" },
                { id: 20, genre: "Comic Book/Graphic Novel" },
            ];
        }
    }
}
