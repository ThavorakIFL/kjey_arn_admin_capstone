export class AdminAuth {
    private static TOKEN_KEY: "admin_token";
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
}
