"use client";

import { Book, BorrowActivity, User } from "../app/types/admin";
import { useAdminData } from "./useAdminData";
import { UserService } from "@/app/services/userService";

export function useUserData() {
    return useAdminData<User[]>(() => UserService.getAllUsers());
}

export function useUserById(id: string) {
    return useAdminData<User>(() => UserService.getUserById(id));
}

export function fetchUserBookById(id: string) {
    return useAdminData<Book[]>(() => UserService.getUserBookById(id));
}

export function fetchUserBorrowDataById(id: string) {
    return useAdminData<BorrowActivity[]>(() =>
        UserService.getUserBorrowDataById(id)
    );
}
