// services/searchApi.ts - Add better debugging and status handling
import api from "@/lib/api/api";
import { User, Book, BorrowActivity } from "../types/admin";
import { AxiosError } from "axios";

// Enhanced search response interface
export interface SearchResponse<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
    type: string;
}

// Search parameters interface
export interface SearchParams {
    query: string;
    page?: number;
    perPage?: number;
    searchFields?: string[];
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: any;
}

export class SearchService {
    static async search<T>(
        resourceType: string,
        params: SearchParams
    ): Promise<SearchResponse<T>> {
        try {
            const endpoint = `/admin/search/${resourceType}`;

            // Build request data carefully
            const requestData: Record<string, any> = {
                query: params.query,
            };

            // Only add fields that have valid values
            if (params.page && params.page > 1) {
                requestData.page = params.page;
            }

            if (params.perPage && params.perPage !== 20) {
                requestData.per_page = params.perPage;
            }

            if (params.searchFields && params.searchFields.length > 0) {
                requestData.fields = params.searchFields.join(",");
            }

            if (params.sortBy && params.sortBy !== "created_at") {
                requestData.sort_by = params.sortBy;
            }

            if (params.sortOrder && params.sortOrder !== "desc") {
                requestData.sort_order = params.sortOrder;
            }

            // Handle additional filters with special status handling
            const additionalFilters = this.extractFilters(params);
            Object.entries(additionalFilters).forEach(([key, value]) => {
                if (key === "status") {
                    // Only add status if it's a valid value
                    if (value === "1" || value === 1 || value === true) {
                        requestData.status = "1";
                    } else if (
                        value === "0" ||
                        value === 0 ||
                        value === false
                    ) {
                        requestData.status = "0";
                    }
                    // Don't add status if it's undefined, null, "all", or any other value
                } else if (
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                ) {
                    requestData[key] = value;
                }
            });
            const response = await api.post<SearchResponse<T>>(
                endpoint,
                requestData
            );
            return response.data;
        } catch (error) {
            console.error("❌ Search Error:", {
                resourceType,
                error,
                params,
            });

            if (error instanceof AxiosError) {
                console.error("❌ Response Error Details:", {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.response?.data?.message,
                });

                const message =
                    error.response?.data?.message ||
                    `${resourceType} search failed`;
                throw new SearchError(message, error.response?.status);
            }
            throw new SearchError("Search failed");
        }
    }

    // Extract additional filters from params
    private static extractFilters(params: SearchParams): Record<string, any> {
        const filters: Record<string, any> = {};
        const excludeKeys = [
            "query",
            "page",
            "perPage",
            "searchFields",
            "sortBy",
            "sortOrder",
        ];

        Object.keys(params).forEach((key) => {
            if (!excludeKeys.includes(key)) {
                filters[key] = params[key];
            }
        });

        return filters;
    }

    // Backward compatibility methods
    static async searchUsers(
        query: string,
        options?: Partial<SearchParams>
    ): Promise<SearchResponse<User>> {
        return this.search<User>("users", {
            query,
            searchFields: ["name", "email"],
            ...options,
        });
    }

    static async searchBooks(
        query: string,
        options?: Partial<SearchParams>
    ): Promise<SearchResponse<Book>> {
        return this.search<Book>("books", {
            query,
            searchFields: ["title", "author"],
            ...options,
        });
    }

    static async searchBorrowActivities(
        query: string,
        options?: Partial<SearchParams>
    ): Promise<SearchResponse<BorrowActivity>> {
        return this.search<BorrowActivity>("borrow-activities", {
            query,
            searchFields: ["user.name", "book.title"],
            ...options,
        });
    }

    // Global search across all resources
    static async globalSearch(query: string, limit: number = 5) {
        try {
            const response = await api.post("/admin/search/global", {
                query,
                limit,
            });
            return response.data;
        } catch (error) {
            console.error("Global search failed:", error);
            if (error instanceof AxiosError) {
                const message =
                    error.response?.data?.message || "Global search failed";
                throw new SearchError(message, error.response?.status);
            }
            throw new SearchError("Global search failed");
        }
    }
}

export class SearchError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = "SearchError";
    }
}
