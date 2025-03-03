export const fetchWithAuth = async (url: string, options = {}): Promise<Response> => {
    return await fetch(url, {
        ...options,
        credentials: "include",
    });
};