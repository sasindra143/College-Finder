const IS_PROD = process.env.NODE_ENV === "production";

// ================= BASE URL =================
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

// ================= CLIENT-SIDE GET CACHE (60s TTL) =================
// Prevents duplicate network calls for the same filters/page within a session
const _cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 60_000; // 60 seconds

function getCached(key: string) {
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit.data;
  _cache.delete(key);
  return null;
}
function setCached(key: string, data: any) {
  // Keep cache lean — evict oldest entry when >200 keys
  if (_cache.size > 200) {
    const firstKey = _cache.keys().next().value;
    if (firstKey !== undefined) _cache.delete(firstKey);
  }
  _cache.set(key, { data, ts: Date.now() });
}


// ================= TYPES =================
import type { College, Exam } from "@/lib/types";
export type { College, Exam };


export interface ApiResponse<T> {
  success: boolean;
  data: T;
  colleges?: T;
  college?: T;
  exam?: T;
  comparisons?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev?: boolean;
    hasNext?: boolean;
  };
}

// ================= CORE REQUEST =================
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const method = (options.method || 'GET').toUpperCase();
  const url = `${API_URL}${path}`;

  // ─ Cache GET requests ────────────────────────────────────────
  const cacheKey = method === 'GET' ? url : null;
  if (cacheKey) {
    const cached = getCached(cacheKey);
    if (cached) return cached as T;
  }

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server");
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  // ─ Store successful GET responses in cache ─────────────────────
  if (cacheKey) setCached(cacheKey, data);

  return data;
}

// ================= API METHODS =================
export const api = {
  // ===== AUTH =====
  login: (body: { email: string; password: string }) =>
    request<any>(`/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  signup: (body: { name: string; email: string; password: string }) =>
    request<any>(`/auth/signup`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: () =>
    request<ApiResponse<any>>(`/auth/me`),

  // ===== COLLEGES =====
  getColleges: (filters: any = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") {
        params.append(k, String(v));
      }
    });

    return request<ApiResponse<College[]>>(
      `/colleges?${params.toString()}`
    );
  },

  getCollege: (id: string) =>
    request<ApiResponse<College>>(`/colleges/${id}`),

  compareColleges: (ids: string[]) =>
    request<ApiResponse<College[]>>(
      `/colleges/compare?ids=${ids.join(",")}`
    ),

  getLocations: () =>
    request<ApiResponse<string[]>>(`/colleges/locations`),

  // ===== EXAMS =====
  getExam: (slug: string) =>
    request<ApiResponse<Exam>>(`/exams/${slug}`),

  // ===== SAVED COLLEGES =====
  getSavedColleges: () =>
    request<ApiResponse<College[]>>(`/saved/colleges`),

  saveCollege: (collegeId: string) =>
    request<ApiResponse<any>>(`/saved/colleges`, {
      method: "POST",
      body: JSON.stringify({ collegeId }),
    }),

  unsaveCollege: (collegeId: string) =>
    request<ApiResponse<any>>(`/saved/colleges/${collegeId}`, {
      method: "DELETE",
    }),

  // ===== COMPARISONS =====
  getSavedComparisons: () =>
    request<ApiResponse<any[]>>(`/saved/comparisons`),

  saveComparison: (name: string, collegeIds: string[]) =>
    request<ApiResponse<any>>(`/saved/comparisons`, {
      method: "POST",
      body: JSON.stringify({ name, collegeIds }),
    }),

  deleteComparison: (id: string) =>
    request<ApiResponse<any>>(`/saved/comparisons/${id}`, {
      method: "DELETE",
    }),

  // ===== Q&A =====
  getQuestions: () =>
    request<ApiResponse<any[]>>(`/qa`),

  getQuestion: (id: string) =>
    request<ApiResponse<any>>(`/qa/${id}`),

  askQuestion: (body: { title: string; body: string }) =>
    request<ApiResponse<any>>(`/qa`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  answerQuestion: (questionId: string, body: { body: string }) =>
    request<ApiResponse<any>>(`/qa/${questionId}/answers`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};