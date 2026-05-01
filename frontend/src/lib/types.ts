export interface College {
  id: string;
  name: string;
  slug: string;

  city?: string;
  state?: string;

  rating?: number;
  fees?: number;
  ownership?: string;

  description?: string;

  // ✅ ADD THIS LINE
  affiliation?: string;
}