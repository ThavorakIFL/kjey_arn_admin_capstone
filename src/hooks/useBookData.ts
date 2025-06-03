"use client";

import { useAdminData } from "./useAdminData";
import { Book } from "@/app/types/admin";
import { BookService } from "@/app/services/bookService";

export function useBookData() {
    return useAdminData<Book[]>(() => BookService.getAllBooks());
}

export function useBookById(id: string) {
    return useAdminData<Book>(() => BookService.getBookById(id));
}
