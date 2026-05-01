// frontend/src/lib/types.ts

export interface College {
  id: string;
  name: string;
  slug: string;

  location?: string;
  city?: string;
  state?: string;

  ownership?: string;
  established?: number;

  fees?: number;
  rating?: number;

  placementPercent?: number;
  avgPackage?: number;

  exams?: string[];
  degrees?: string[];

  description?: string;
  imageUrl?: string;
}