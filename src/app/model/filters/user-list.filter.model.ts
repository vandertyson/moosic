export interface UserListFilter {
    search_query?:string;
    role?: number;
    active?: number;
    page?: number;
    per_page?: number;
    sort_by?: string;
    page_count?: number;
}
