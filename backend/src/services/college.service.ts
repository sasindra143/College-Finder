import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

interface CollegeFilters {
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

export const getColleges = async (filters: CollegeFilters) => {
  const {
    search,
    location,
    minFees,
    maxFees,
    ownership,
    minRating,
    course,
    page = 1,
    limit = 12,
    sortBy = 'rating',
    sortOrder = 'desc',
  } = filters;

  const where: Prisma.CollegeWhereInput = {
    AND: []
  };

  if (search) {
    (where.AND as Prisma.CollegeWhereInput[]).push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ]
    });
  }

  if (location) {
    (where.AND as Prisma.CollegeWhereInput[]).push({
      OR: [
        { city: { contains: location, mode: 'insensitive' } },
        { state: { contains: location, mode: 'insensitive' } },
      ]
    });
  }

  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees.gte = minFees;
    if (maxFees !== undefined) where.fees.lte = maxFees;
  }

  if (ownership) where.ownership = { contains: ownership, mode: 'insensitive' };
  if (minRating !== undefined) where.rating = { gte: minRating };
  if (course) {
    const courseTerm = course.toLowerCase();
    (where.AND as Prisma.CollegeWhereInput[]).push({
      OR: [
        { degrees: { hasSome: [course] } },
        { name: { contains: course, mode: 'insensitive' } },
        { description: { contains: course, mode: 'insensitive' } },
      ]
    });
  }

  const validSortFields = ['rating', 'fees', 'nirfRank', 'name', 'established', 'placementPercent'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'rating';

  const skip = (page - 1) * limit;

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { [orderField]: sortOrder },
        { id: 'asc' } // Guarantee stable sort for pagination
      ],
      select: {
        id: true, name: true, slug: true, location: true,
        city: true, state: true, ownership: true, fees: true,
        rating: true, totalReviews: true, placementPercent: true,
        avgPackage: true, imageUrl: true, nirfRank: true,
        accreditation: true, naacGrade: true, established: true,
        exams: true, degrees: true, website: true, affiliation: true,
        _count: { select: { courses: true } },
      },
    }),
    prisma.college.count({ where }),
  ]);

  return {
    colleges,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const getCollegeById = async (id: string) => {
  return prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
};

export const getCollegeBySlug = async (slug: string) => {
  return prisma.college.findUnique({
    where: { slug },
    include: {
      courses: true,
      reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
};

export const getCollegesForComparison = async (ids: string[]) => {
  return prisma.college.findMany({
    where: { id: { in: ids } },
    include: { courses: true },
  });
};

export const getUniqueLocations = async () => {
  const states = await prisma.college.findMany({
    select: { state: true, city: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  });
  return states;
};

export const bulkCreateColleges = async (colleges: any[]) => {
  let count = 0;
  for (const c of colleges) {
    const slug = (c.slug || c.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')).replace(/^-|-$/g, '');
    try {
      await prisma.college.upsert({
        where: { slug },
        update: {},
        create: {
          name: c.name,
          slug,
          location: c.location || `${c.city}, ${c.state}`,
          city: c.city || 'Unknown',
          state: c.state || 'Unknown',
          ownership: c.ownership || 'Private',
          established: c.established || 2000,
          fees: c.fees || 50000,
          rating: c.rating || 4.0,
          totalReviews: c.totalReviews || 0,
          placementPercent: c.placementPercent || 70,
          avgPackage: c.avgPackage || 4,
          description: c.description || `${c.name} is a renowned college in India.`,
          imageUrl: c.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
          accreditation: c.accreditation || 'UGC',
          exams: c.exams || [],
          degrees: c.degrees || [],
          website: c.website,
          affiliation: c.affiliation,
          courses: {
            create: [
              { name: 'Bachelor of Technology', duration: '4 Years', fees: c.fees || 80000, seats: 120, eligibility: '12th PCM' }
            ]
          }
        }
      });
      count++;
    } catch (e) {
      console.error('Import error for:', c.name, e);
    }
  }
  return count;
};
