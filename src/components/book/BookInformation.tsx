"use client";

import { Book } from "@/app/types/admin";

interface BookInformationProps {
    data: Book;
}

export default function BookInformation({ data }: BookInformationProps) {
    return (
        <div>
            <h1>Book Title: {data.title}</h1>
            <p>Author: {data.author}</p>
            <p>Published Date: {data.condition}</p>
            <p>Description: {data.description}</p>
        </div>
    );
}
