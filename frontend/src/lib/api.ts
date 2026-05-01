const IS_PROD = process.env.NODE_ENV === "production";

let BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (IS_PROD
    ? "https://college-finder-hu2a.onrender.com/api"
    : "http://localhost:5000/api");

if (!BASE_URL.endsWith("/api")) {
  BASE_URL = BASE_URL.endsWith("/") ? `${BASE_URL}api` : `${BASE_URL}/api`;
}

const API_URL = BASE_URL;

console.log("🚀 API URL:", API_URL);

// ✅ GENERIC RESPONSE TYPE
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
}

// ✅ IMPORTANT FIX HERE
import type { College } from "@/lib/types";

export const api = {
  getColleges: (filters: any = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") {
        params.append(k, String(v));
      }
    });

    return request<ApiResponse<College[]>>(`/colleges?${params.toString()}`);
  },

  getCollege: (id: string) =>
    request<ApiResponse<College>>(`/colleges/${id}`),

  compareColleges: (ids: string[]) =>
    request<ApiResponse<College[]>>(`/colleges/compare?ids=${ids.join(",")}`),

  getLocations: () =>
    request<ApiResponse<string[]>>(`/colleges/locations`),
};