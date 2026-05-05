import { fetchAuthSession } from "aws-amplify/auth";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;

async function getHeaders() {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    if (!idToken) throw new Error("User not authenticated");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
    };
}

async function handleResponse(res: Response) {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
}

// Public
export async function getAllBusinesses() {
    const res = await fetch(`${API_URL}/businesses`);
    return handleResponse(res);
}

export async function getBusiness(id: string | undefined) {
    if (!id) return { business: null };
    const res = await fetch(`${API_URL}/businesses/${id}`);
    return handleResponse(res);
}

export async function getAllReviews(businessId: string | undefined) {
    if (!businessId) return { reviews: [] };
    const res = await fetch(`${API_URL}/businesses/${businessId}/reviews`);
    return handleResponse(res);
}

// Superadmin only

export async function getDashboardData() {
    const res = await fetch(`${API_URL}/dashboard`, {
        method: "GET",
        headers: await getHeaders(),
    });
    return handleResponse(res);
}

export async function createBusiness(data: any) {
    const res = await fetch(`${API_URL}/businesses`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function updateBusiness(id: string, data: any) {
    const res = await fetch(`${API_URL}/businesses/${id}`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function deleteBusiness(id: string) {
    const res = await fetch(`${API_URL}/businesses/${id}`, {
        method: "DELETE",
        headers: await getHeaders(),
    });
    return handleResponse(res);
}

// Logged in users only
export async function addReview(businessId: string, rating: number, comment: string) {
    const res = await fetch(`${API_URL}/businesses/${businessId}/reviews`, {
        method: "POST",
        headers: await getHeaders(),
        body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(res);
}

// Managed in public section

export async function updateReview(businessId: string, rating: number, comment: string) {
    const res = await fetch(`${API_URL}/businesses/${businessId}/reviews`, {
        method: "PUT",
        headers: await getHeaders(),
        body: JSON.stringify({ rating, comment }),
    });
    return handleResponse(res);
}

export async function deleteReview(businessId: string) {
    const res = await fetch(`${API_URL}/businesses/${businessId}/reviews`, {
        method: "DELETE",
        headers: await getHeaders(),
    });
    return handleResponse(res);
}

//Reviews delete by superadmin
export async function deleteReviewBySuperadmin(businessId: string, userId: string) {
    const res = await fetch(`${API_URL}/businesses/${businessId}/reviews/${userId}`, {
        method: "DELETE",
        headers: await getHeaders(),
    });
    return handleResponse(res);
}