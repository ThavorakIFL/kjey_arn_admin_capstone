export class AdminAuth {
    private static TOKEN_KEY = "admin_token";
    private static SUPER_ADMIN_KEY = "super_admin";

    static setToken(token: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.TOKEN_KEY, token);
        }
    }

    static getToken(): string | null {
        if (typeof window !== "undefined") {
            return localStorage.getItem(this.TOKEN_KEY);
        }
        return null;
    }

    static removeToken(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.TOKEN_KEY);
        }
    }

    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    static setIsSuperAdmin(type: string): void {
        if (typeof window !== "undefined") {
            localStorage.setItem(this.SUPER_ADMIN_KEY, type);
        }
    }

    static getIsSuperAdmin(): string | null {
        if (typeof window !== "undefined") {
            const value = localStorage.getItem(this.SUPER_ADMIN_KEY);
            return value;
        }
        return null;
    }

    static removeIsSuperAdmin(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem(this.SUPER_ADMIN_KEY);
        }
    }
}
