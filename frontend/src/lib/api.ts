const IS_PROD = process.env.NODE_ENV === "production";

// ✅ FINAL BASE URL LOGIC
let BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (IS_PROD
    ? "https://college-finder-hu2a.onrender.com/api"
    : "http://localhost:5000/api");

// Ensure /api suffix
if (!BASE_URL.endsWith("/api")) {
  BASE_URL = BASE_URL.endsWith("/")
    ? `${BASE_URL}api`
    : `${BASE_URL}/api`;
}

const API_URL = BASE_URL;

console.log("🚀 API URL:", API_URL);

// ✅ SAFE REQUEST FUNCTION (FIXED)
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_URL}${path}`;

  try {
    let token: string | null = null;

    // ✅ FIX: avoid SSR crash
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    const res = await fetch(fullUrl, {
      method: options?.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store", // ✅ CRITICAL FOR NEXT.JS
      ...options,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("❌ Fetch failed:", fullUrl, err.message);
    throw err;
  }
}

// ✅ API METHODS
export const api = {
  getColleges: (filters: any = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") {
        params.append(k, String(v));
      }
    });

    return request(`/colleges?${params.toString()}`);
  },

  getCollege: (id: string) => request(`/colleges/${id}`),

  compareColleges: (ids: string[]) =>
    request(`/colleges/compare?ids=${ids.join(",")}`),

  getLocations: () => request(`/colleges/locations`),
};