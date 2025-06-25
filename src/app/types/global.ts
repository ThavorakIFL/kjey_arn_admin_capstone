interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface DashboardStats {
    total_users: number;
    total_books: number;
    total_borrow_events: number;
}

interface DashboardBorrowEventStatusCount {
    id: number;
    status: string;
    count: number;
}
