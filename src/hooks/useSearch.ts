import { useState, useCallback } from "react";
import { SearchService, SearchError } from "@/app/services/searchApi";
import { User } from "@/app/types/admin";

interface UseUserSearchReturn {
    users: User[];
    loading: boolean;
    error: string | null;
    search: (query: string) => Promise<void>;
    clearResults: () => void;
}

export const useUserSearch = (): UseUserSearchReturn => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const search = useCallback(async (query: string) => {
        if (query.length < 2) {
            setUsers([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await SearchService.searchUsers(query);
            setUsers(response.data);
        } catch (err) {
            const errorMessage =
                err instanceof SearchError
                    ? err.message
                    : "Search failed. Please try again.";
            setError(errorMessage);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearResults = useCallback(() => {
        setUsers([]);
        setError(null);
    }, []);

    return { users, loading, error, search, clearResults };
};
