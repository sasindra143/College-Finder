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

// Debug
if (typeof window !== "undefined") {
  console.log("🚀 API URL:", API_URL);
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

  const res = await fetch(`${API_URL}${path}`, {
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
    request<ApiResponse<College[]>>(`/saved`),

  saveCollege: (collegeId: string) =>
    request<ApiResponse<any>>(`/saved`, {
      method: "POST",
      body: JSON.stringify({ collegeId }),
    }),

  unsaveCollege: (collegeId: string) =>
    request<ApiResponse<any>>(`/saved/${collegeId}`, {
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