import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AdminSearchProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    placeholder?: string;
    isSearching?: boolean;
    className?: string;
    showClearButton?: boolean;
    disabled?: boolean;
}

export function AdminSearch({
    searchTerm,
    onSearchChange,
    placeholder = "Search...",
    isSearching = false,
    className = "",
    showClearButton = true,
    disabled = false,
}: AdminSearchProps) {
    return (
        <div className={`relative ${className}`}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={disabled}
                className="pl-10 pr-20 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors disabled:opacity-50"
            />

            {/* Loading indicator */}
            {isSearching && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                </div>
            )}

            {/* Clear button */}
            {showClearButton && searchTerm && !isSearching && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
                    onClick={() => onSearchChange("")}
                    disabled={disabled}
                >
                    <X className="h-3 w-3" />
                </Button>
            )}
        </div>
    );
}
