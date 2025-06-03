import api from "@/lib/api";
import { User } from "../types/admin";
import { SearchResponse } from "../types/search";
import { AxiosError } from "axios";

export class SearchService {
    static async searchUsers(query: string): Promise<SearchResponse<User>> {
        try {
            const response = await api.post<SearchResponse<User>>(
                "/admin/search/users",
                {
                    query,
                }
            );
            return response.data;
        } catch (error) {
            console.error("User search failed:", error);
            if (error instanceof AxiosError) {
                const message =
                    error.response?.data?.message || "User search failed";
                throw new SearchError(message, error.response?.status);
            }
            throw new SearchError("Search failed");
        }
    }
}

export class SearchError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "SearchError";
    }
}
