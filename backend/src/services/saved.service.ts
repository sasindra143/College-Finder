import { prisma } from '../lib/prisma';
import { createError } from '../middleware/error.middleware';

export const saveCollege = async (userId: string, collegeId: string) => {
  const college = await prisma.college.findUnique({ where: { id: collegeId } });
  if (!college) throw createError('College not found', 404);

  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (existing) throw createError('College already saved', 409);

  return prisma.savedCollege.create({
    data: { userId, collegeId },
    include: { college: { select: { id: true, name: true, slug: true, location: true, fees: true, rating: true, imageUrl: true } } },
  });
};

export const unsaveCollege = async (userId: string, collegeId: string) => {
  const existing = await prisma.savedCollege.findUnique({
    where: { userId_collegeId: { userId, collegeId } },
  });
  if (!existing) throw createError('College not in saved list', 404);
  return prisma.savedCollege.delete({ where: { userId_collegeId: { userId, collegeId } } });
};

export const getSavedColleges = async (userId: string) => {
  return prisma.savedCollege.findMany({
    where: { userId },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, location: true, city: true, state: true,
          fees: true, rating: true, imageUrl: true, placementPercent: true, ownership: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const saveComparison = async (userId: string, name: string, collegeIds: string[]) => {
  if (collegeIds.length < 2 || collegeIds.length > 3)
    throw createError('Comparison must include 2-3 colleges', 400);
  return prisma.savedComparison.create({ data: { userId, name, collegeIds } });
};

export const getSavedComparisons = async (userId: string) => {
  return prisma.savedComparison.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteSavedComparison = async (userId: string, comparisonId: string) => {
  const existing = await prisma.savedComparison.findFirst({
    where: { id: comparisonId, userId },
  });
  if (!existing) throw createError('Comparison not found', 404);
  return prisma.savedComparison.delete({ where: { id: comparisonId } });
};
