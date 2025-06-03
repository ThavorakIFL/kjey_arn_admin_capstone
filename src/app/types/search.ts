export interface SearchResponse<T> {
    data: T[];
    count: number;
    type: string;
}

export interface SearchError {
    message: string;
    status?: number;
}
