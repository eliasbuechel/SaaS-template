import { NEXT_PUBLIC_AUTH_SERVICE_URL } from "@/lib/config";

export const fetchWithAuth = async (url: string, options = {}) => {
    let response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (response.status === 401) {
        console.warn("Access token expired. Attempting refresh...");

        const refreshResponse = await fetch(`${NEXT_PUBLIC_AUTH_SERVICE_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (refreshResponse.ok) {
            console.info("Token refreshed successfully. Retrying request...");
            return fetch(url, { ...options, credentials: "include" });
        } else {
            if (window.location.pathname === "/login") {
                console.warn("Failed to refresh token.");
                return null;
            }
            
            console.warn("Failed to refresh token. Redirecting to login...");
            window.location.href = "/login";
            return null;
        }
    }

    return response;
};
