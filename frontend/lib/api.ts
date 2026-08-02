export async function api(url: string, options: RequestInit = {}) {

    const token = localStorage.getItem("token");

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
    return fetch(`${BASE_URL}${url}`, {
        ...options,

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}