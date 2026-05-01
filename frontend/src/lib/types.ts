// ================= COURSE =================
export interface Course {
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
}

// ================= REVIEW =================
export interface Review {
  authorName?: string;
  name?: string;
  rating: number;
  comment: string;
  year: number;
}

// ================= COLLEGE =================
export interface College {
  id: string;
  name: string;
  slug?: string;

  city: string;
  state: string;
  location?: string;

  ownership?: string;
  established?: number;

  fees: number;
  rating?: number;

  placementPercent?: number;
  avgPackage?: number;

  exams?: string[];
  degrees?: string[];

  description?: string;
  imageUrl?: string;

  accreditation?: string;
  naacGrade?: string;
  nirfRank?: number;
  affiliation?: string;
  website?: string;

  totalReviews?: number;

  // ✅ FIXED (used in UI)
  courses?: Course[];
  reviews?: Review[];

  // ✅ EXTRA SAFE FIELDS (prevent future errors)
  category?: string;
  highlights?: string[];
}

// ================= EXAM =================
export interface Exam {
  id: string;
  name: string;
  slug: string;

  // ✅ already used in UI
  category?: string;

  // ✅ FIX THIS ERROR
  content?: string;

  description?: string;
  date?: string;
  eligibility?: string;
  syllabus?: string;

  // extra safe fields
  duration?: string;
  level?: string;
  conductingBody?: string;
  applicationMode?: string;
  officialWebsite?: string;
}