"use client";

import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { useUserSearch } from "@/hooks/useSearch";
import { User } from "@/app/types/admin";

interface UserSearchProps {
    onUserSelect?: (user: User) => void;
    placeholder?: string;
    className?: string;
}

const UserSearch: React.FC<UserSearchProps> = ({
    onUserSelect,
    placeholder = "Search users...",
    className = "user-search",
}) => {
    const [query, setQuery] = useState("");
    const { users, loading, error, search } = useUserSearch();
    const debouncedSearch = useCallback(
        debounce((searchQuery: string) => {
            search(searchQuery);
        }, 300),
        [search]
    );

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleUserClick = (user: User) => {
        if (onUserSelect) {
            onUserSelect(user);
        }
    };

    return (
        <div className={className}>
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
            />

            {loading && <div className="loading">Searching...</div>}
            {error && <div className="error">{error}</div>}

            <div className="results">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="user-item"
                        onClick={() => handleUserClick(user)}
                        role="button"
                        tabIndex={0}
                    >
                        {user.picture && (
                            <img
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                    user.picture
                                }
                                alt={`${user.name}'s profile`}
                                className="user-avatar"
                            />
                        )}
                        <div className="user-info">
                            <h4>{user.name}</h4>
                            <p>{user.email}</p>
                        </div>
                    </div>
                ))}

                {query.length >= 2 && users.length === 0 && !loading && (
                    <div className="no-results">
                        No users found for "{query}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSearch;
