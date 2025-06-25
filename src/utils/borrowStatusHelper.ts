import { BorrowActivityStats } from "@/components/BorrowActivityChart";

// utils/borrowStatusHelper.ts
export const BorrowStatusMap = {
    1: "Pending Borrow Activity",
    2: "Accepted By Lender",
    3: "Borrowing In Progress",
    4: "Return Confirmation",
    5: "Rejected",
    6: "Cancelled",
    7: "Completed",
    8: "Reported", // or whatever status 8 represents
} as const;

export const normalizeStatusData = (
    apiData: Array<{ id: number; status: string; count: number }>
): BorrowActivityStats[] => {
    const dataMap = new Map(apiData.map((item) => [item.status, item]));

    return Object.values(BorrowStatusMap).map((statusName) => {
        const existing = Array.from(dataMap.values()).find(
            (item) => item.status === statusName
        );
        return {
            status: statusName,
            count: existing?.count || 0,
            percentage: existing
                ? (existing.count /
                      apiData.reduce((sum, item) => sum + item.count, 0)) *
                  100
                : 0,
            // Add trend data if available
            // trend: existing?.trend,
            // trendValue: existing?.trendValue,
        };
    });
};
