"use client";

import { User } from "../app/types/admin";
import { useAdminData } from "./useAdminData";
import { UserService } from "@/app/services/userService";

export function useUserData() {
    return useAdminData<User[]>(() => UserService.getAllUsers());
}

export function useUserById(id: string) {
    return useAdminData<User>(() => UserService.getUserById(id));
}
