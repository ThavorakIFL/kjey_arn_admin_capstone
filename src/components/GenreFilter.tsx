// components/GenreFilter.tsx
import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GenreService } from "@/app/services/genreService";
import { Genre } from "@/app/types/admin";

interface GenreFilterProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
}

export function GenreFilter({
    value,
    onValueChange,
    className,
}: GenreFilterProps) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                setLoading(true);
                const genreList = await GenreService.getGenres();
                setGenres(genreList);
            } catch (error) {
                console.error("Failed to load genres:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={`w-40 ${className}`}>
                <SelectValue
                    placeholder={loading ? "Loading..." : "All Genres"}
                />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id!.toString()}>
                        {genre.genre}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
