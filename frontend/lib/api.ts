export async function api(url: string, options: RequestInit = {}) {

    const token = localStorage.getItem("token");

    return fetch(`http://localhost:4000${url}`, {
        ...options,

        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
}