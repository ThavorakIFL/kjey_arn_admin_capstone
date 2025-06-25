// hooks/useSearch.ts - Fixed to prevent too many requests
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
    SearchService,
    SearchError,
    SearchResponse,
} from "@/app/services/searchApi";
import { useDebounce } from "@/hooks/useDebounce";
import { User, Book, BorrowActivity } from "@/app/types/admin";

export type SearchResourceType = "users" | "books" | "borrow-activities";

// Type mapping for resources
type ResourceTypeMap = {
    users: User;
    books: Book;
    "borrow-activities": BorrowActivity;
};

export interface SearchConfig {
    resourceType: SearchResourceType;
    minQueryLength?: number;
    debounceMs?: number;
    autoSearch?: boolean;
    searchFields?: string[];
    filters?: Record<string, any>;
    loadInitialData?: boolean;
}

interface UseSearchReturn<T> {
    results: T[];
    total: number;
    loading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    search: (query: string, page?: number) => Promise<void>;
    clearResults: () => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    loadMore: () => Promise<void>;
}

// Generic useSearch hook
export const useSearch = <T extends SearchResourceType>(
    config: SearchConfig & { resourceType: T }
): UseSearchReturn<ResourceTypeMap[T]> => {
    const [results, setResults] = useState<ResourceTypeMap[T][]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    // Use refs to track if component is mounted and prevent duplicate calls
    const isMountedRef = useRef(true);
    const lastSearchRef = useRef<string>("");
    const lastFiltersRef = useRef<string>("");

    const {
        resourceType,
        minQueryLength = 2,
        debounceMs = 300,
        autoSearch = true,
        searchFields,
        filters = {},
        loadInitialData = true,
    } = config;

    // Memoize filters to prevent recreation on every render
    const memoizedFilters = useMemo(() => filters, [JSON.stringify(filters)]);
    const filtersString = JSON.stringify(memoizedFilters);

    // Debounce search term for auto-search
    const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Clear results function - stable reference
    const clearResults = useCallback(() => {
        if (!isMountedRef.current) return;
        setResults([]);
        setTotal(0);
        setCurrentPage(1);
        setHasMore(false);
        setError(null);
    }, []);

    // Search function with stable dependencies
    const search = useCallback(
        async (query: string, page: number = 1) => {
            if (!isMountedRef.current) return;

            // Prevent duplicate searches
            const searchKey = `${query}_${page}_${filtersString}`;
            if (searchKey === lastSearchRef.current && page === 1) {
                console.log("🚫 Duplicate search prevented:", searchKey);
                return;
            }
            lastSearchRef.current = searchKey;

            // For empty queries, use a placeholder search that gets all data
            const actualQuery = query.trim() || "a";

            if (query.trim().length > 0 && query.length < minQueryLength) {
                if (query.length === 0) {
                    setResults([]);
                    setTotal(0);
                    setCurrentPage(1);
                    setHasMore(false);
                    setError(null);
                }
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const searchParams = {
                    query: actualQuery,
                    page,
                    searchFields,
                    ...memoizedFilters,
                };

                console.log("🔍 Search called with:", {
                    originalQuery: query,
                    actualQuery,
                    searchParams,
                    resourceType,
                });

                let response: SearchResponse<ResourceTypeMap[T]>;

                switch (resourceType) {
                    case "users":
                        response = (await SearchService.searchUsers(
                            actualQuery,
                            searchParams
                        )) as SearchResponse<ResourceTypeMap[T]>;
                        break;
                    case "books":
                        response = (await SearchService.searchBooks(
                            actualQuery,
                            searchParams
                        )) as SearchResponse<ResourceTypeMap[T]>;
                        break;
                    case "borrow-activities":
                        response = (await SearchService.searchBorrowActivities(
                            actualQuery,
                            searchParams
                        )) as SearchResponse<ResourceTypeMap[T]>;
                        break;
                    default:
                        throw new Error(
                            `Unsupported resource type: ${resourceType}`
                        );
                }

                if (!isMountedRef.current) return;

                if (page === 1) {
                    setResults(response.data);
                    setCurrentPage(1);
                } else {
                    setResults((prev) => [...prev, ...response.data]);
                    setCurrentPage(page);
                }

                setTotal(response.total);
                setHasMore(response.hasMore);

                if (!initialDataLoaded) {
                    setInitialDataLoaded(true);
                }
            } catch (err) {
                if (!isMountedRef.current) return;

                const errorMessage =
                    err instanceof SearchError
                        ? err.message
                        : "Search failed. Please try again.";
                setError(errorMessage);

                if (page === 1) {
                    setResults([]);
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        },
        [
            resourceType,
            minQueryLength,
            searchFields,
            memoizedFilters,
            initialDataLoaded,
            filtersString,
        ]
    );

    // Load initial data when component mounts - only once
    useEffect(() => {
        if (
            loadInitialData &&
            !initialDataLoaded &&
            !loading &&
            isMountedRef.current
        ) {
            console.log("🚀 Loading initial data for", resourceType);
            search("", 1);
        }
    }, [loadInitialData]); // Removed other dependencies to prevent re-runs

    // Auto-search effect - prevent duplicate calls
    useEffect(() => {
        if (!isMountedRef.current) return;

        // Prevent filter-only changes from triggering auto-search when there's no search term
        if (filtersString !== lastFiltersRef.current) {
            lastFiltersRef.current = filtersString;

            // Only trigger search if we have a search term or need to reload data
            if (
                debouncedSearchTerm.length >= minQueryLength ||
                (debouncedSearchTerm.length === 0 && initialDataLoaded)
            ) {
                console.log("🔄 Filter change detected, searching...");
                search(debouncedSearchTerm, 1);
            }
            return;
        }

        // Normal auto-search logic
        if (autoSearch && debouncedSearchTerm.length >= minQueryLength) {
            console.log("🔍 Auto-search triggered for:", debouncedSearchTerm);
            search(debouncedSearchTerm, 1);
        } else if (
            autoSearch &&
            debouncedSearchTerm.length === 0 &&
            initialDataLoaded
        ) {
            console.log("🔄 Search term cleared, reloading initial data");
            search("", 1);
        }
    }, [
        debouncedSearchTerm,
        filtersString,
        autoSearch,
        minQueryLength,
        initialDataLoaded,
    ]);

    const loadMore = useCallback(async () => {
        if (
            hasMore &&
            !loading &&
            (searchTerm || initialDataLoaded) &&
            isMountedRef.current
        ) {
            await search(searchTerm, currentPage + 1);
        }
    }, [hasMore, loading, searchTerm, currentPage, search, initialDataLoaded]);

    return {
        results,
        total,
        loading,
        error,
        hasMore,
        currentPage,
        search,
        clearResults,
        searchTerm,
        setSearchTerm,
        loadMore,
    };
};

// Specific hooks for different resources (properly typed)
export const useUserSearch = (config?: Omit<SearchConfig, "resourceType">) => {
    const memoizedConfig = useMemo(
        () => ({
            resourceType: "users" as const,
            searchFields: ["name", "email"],
            minQueryLength: 1, // Reduced to 1 to allow broader searches
            loadInitialData: true,
            debounceMs: 500, // Increased debounce time
            ...config,
        }),
        [
            config?.autoSearch,
            config?.debounceMs,
            config?.minQueryLength,
            config?.loadInitialData,
            JSON.stringify(config?.filters),
            JSON.stringify(config?.searchFields),
        ]
    );

    return useSearch(memoizedConfig);
};

export const useBookSearch = (config?: Omit<SearchConfig, "resourceType">) => {
    const memoizedConfig = useMemo(
        () => ({
            resourceType: "books" as const,
            searchFields: ["title", "author"],
            minQueryLength: 1, // Reduced to 1 to allow broader searches
            loadInitialData: true,
            debounceMs: 500, // Increased debounce time
            ...config,
        }),
        [
            config?.autoSearch,
            config?.debounceMs,
            config?.minQueryLength,
            config?.loadInitialData,
            JSON.stringify(config?.filters),
            JSON.stringify(config?.searchFields),
        ]
    );

    return useSearch(memoizedConfig);
};

export const useBorrowActivitySearch = (
    config?: Omit<SearchConfig, "resourceType">
) => {
    const memoizedConfig = useMemo(
        () => ({
            resourceType: "borrow-activities" as const,
            searchFields: ["user.name", "book.title"],
            minQueryLength: 1,
            loadInitialData: true,
            debounceMs: 500,
            ...config,
        }),
        [
            config?.autoSearch,
            config?.debounceMs,
            config?.minQueryLength,
            config?.loadInitialData,
            JSON.stringify(config?.filters),
            JSON.stringify(config?.searchFields),
        ]
    );

    return useSearch(memoizedConfig);
};
