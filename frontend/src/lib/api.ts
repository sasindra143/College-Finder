const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  ownership: string;
  established: number;
  fees: number;
  rating: number;
  totalReviews: number;
  placementPercent: number;
  avgPackage: number;
  description: string;
  imageUrl?: string;
  website?: string;
  affiliation?: string;
  accreditation?: string;
  naacGrade?: string;
  nirfRank?: number;
  exams?: string[];
  degrees?: string[];
  courses?: Course[];
  reviews?: Review[];
  _count?: { courses: number };
}

export interface Exam {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  eligibility?: string;
  syllabus?: string;
  dates: ExamDate[];
  imageUrl?: string;
}

export interface ExamDate {
  id: string;
  event: string;
  date: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  year: number;
}

export interface SavedCollege {
  id: string;
  collegeId: string;
  userId: string;
  college: College;
}

export interface Comparison {
  id: string;
  name: string;
  collegeIds: string[];
  userId: string;
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  body: string;
  authorId: string;
  author: { name: string };
  createdAt: string;
  _count: { answers: number };
  answers?: Answer[];
}

export interface Answer {
  id: string;
  body: string;
  authorId: string;
  author: { name: string };
  createdAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface CollegesResponse {
  success: boolean;
  colleges: College[];
  pagination: PaginationInfo;
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  minFees?: number;
  maxFees?: number;
  ownership?: string;
  minRating?: number;
  course?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  // Colleges
  getColleges: (filters: CollegeFilters = {}): Promise<CollegesResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    return request(`/colleges?${params.toString()}`);
  },

  getCollege: (id: string): Promise<{ success: boolean; data: College }> =>
    request(`/colleges/${id}`),

  compareColleges: (ids: string[]): Promise<{ success: boolean; data: College[] }> =>
    request(`/colleges/compare?ids=${ids.join(',')}`),

  getLocations: (): Promise<{ success: boolean; data: { state: string; city: string }[] }> =>
    request('/colleges/locations'),

  // Exams
  getExams: (): Promise<{ success: boolean; data: Exam[] }> => request('/exams'),
  getExam: (slug: string): Promise<{ success: boolean; data: Exam }> => request(`/exams/${slug}`),

  // Auth
  signup: (data: { name: string; email: string; password: string }) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request('/auth/me'),

  // Saved
  getSavedColleges: (): Promise<{ success: boolean; data: SavedCollege[] }> => request('/saved/colleges'),
  saveCollege: (collegeId: string) =>
    request('/saved/colleges', { method: 'POST', body: JSON.stringify({ collegeId }) }),
  unsaveCollege: (collegeId: string) =>
    request(`/saved/colleges/${collegeId}`, { method: 'DELETE' }),

  getSavedComparisons: (): Promise<{ success: boolean; data: Comparison[] }> => request('/saved/comparisons'),
  saveComparison: (data: { name: string; collegeIds: string[] }) =>
    request('/saved/comparisons', { method: 'POST', body: JSON.stringify(data) }),
  deleteComparison: (id: string) =>
    request(`/saved/comparisons/${id}`, { method: 'DELETE' }),

  // Q&A
  getQuestions: (): Promise<{ success: boolean; data: Question[] }> => request('/qa'),
  getQuestion: (id: string): Promise<{ success: boolean; data: Question }> => request(`/qa/${id}`),
  askQuestion: (data: { title: string; body: string }) =>
    request('/qa', { method: 'POST', body: JSON.stringify(data) }),
  answerQuestion: (id: string, data: { body: string }) =>
    request(`/qa/${id}/answers`, { method: 'POST', body: JSON.stringify(data) }),
};
