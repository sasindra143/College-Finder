export interface Course {
  name: string;
  duration: string;
  fees: number;
  seats: number;
  eligibility: string;
}

export interface Review {
  authorName?: string;
  name?: string;
  rating: number;
  comment: string;
  year: number;
}

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

  // ✅ IMPORTANT FIX
  courses?: Course[];
  reviews?: Review[];
}

export interface Exam {
  id: string;
  name: string;
  slug: string;
  description?: string;
  date?: string;
  eligibility?: string;
  syllabus?: string;
}