"use client";

import { StandardService } from "@/app/services/standardServices";
import { DashboardStats } from "../app/types/admin";
import { useAdminData } from "./useAdminData";

export function useDashboardData() {
    return useAdminData<DashboardStats>(() =>
        StandardService.getDashboardStats()
    );
}
