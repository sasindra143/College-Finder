import { z } from 'zod';

export const saveCollegeSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
});

export const saveComparisonSchema = z.object({
  name: z.string().min(1, 'Comparison name is required').max(100),
  collegeIds: z
    .array(z.string())
    .min(2, 'At least 2 colleges required')
    .max(3, 'Maximum 3 colleges allowed'),
});
