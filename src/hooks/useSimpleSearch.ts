// hooks/useSimpleSearch.ts
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/api";

interface SearchConfig {
    endpoint: string;
    searchFields?: string[];
    initialLoad?: boolean;
    debounceMs?: number;
}

interface SearchResponse<T> {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    hasMore: boolean;
}

export function useSimpleSearch<T>(config: SearchConfig) {
    const [data, setData] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState<Record<string, any>>({});

    // Simple debounce
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, config.debounceMs || 300);
        return () => clearTimeout(timer);
    }, [searchTerm, config.debounceMs]);

    // Main search function
    const search = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params: Record<string, any> = {};

            // Add search query
            if (debouncedSearchTerm.trim()) {
                params.query = debouncedSearchTerm.trim();
            } else {
                params.query = "a"; // Broad search
            }

            // Add search fields
            if (config.searchFields && config.searchFields.length > 0) {
                params.fields = config.searchFields.join(",");
            }

            // Add filters
            Object.entries(filters).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== "" &&
                    value !== "all"
                ) {
                    params[key] = value;
                }
            });

            console.log("🔍 Searching:", { endpoint: config.endpoint, params });

            const response = await api.post<SearchResponse<T>>(
                config.endpoint,
                params
            );

            setData(response.data.data);
            setTotal(response.data.total);

            console.log("✅ Search results:", {
                total: response.data.total,
                count: response.data.data.length,
            });
        } catch (err: any) {
            console.error("❌ Search failed:", err);
            setError(err.response?.data?.message || "Search failed");
            setData([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }, [config.endpoint, config.searchFields, debouncedSearchTerm, filters]);

    // Trigger search when search term or filters change
    useEffect(() => {
        search();
    }, [search]);

    // Initial load
    useEffect(() => {
        if (config.initialLoad !== false) {
            search();
        }
    }, []); // Only on mount

    const updateFilters = useCallback((newFilters: Record<string, any>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({});
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm("");
        setFilters({});
    }, []);

    return {
        data,
        total,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        filters,
        updateFilters,
        clearFilters,
        clearSearch,
        refetch: search,
    };
}

// Specific hooks for each resource
export const useUserSearch = (filters?: Record<string, any>) => {
    return useSimpleSearch({
        endpoint: "/admin/search/users",
        searchFields: ["name", "email"],
        initialLoad: true,
    });
};

export const useBookSearch = (filters?: Record<string, any>) => {
    return useSimpleSearch({
        endpoint: "/admin/search/books",
        searchFields: ["title", "author"],
        initialLoad: true,
    });
};
