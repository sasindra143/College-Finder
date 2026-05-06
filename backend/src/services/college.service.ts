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
  exam?: string;
  rank?: number;
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
    exam,
    rank,
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
        { degrees: { hasSome: [search] } },
      ]
    });
  }

  if (location) {
    const locs = location.split(',').map(l => l.trim()).filter(Boolean);
    if (locs.length > 0) {
      (where.AND as Prisma.CollegeWhereInput[]).push({
        OR: locs.flatMap(loc => [
          { city: { contains: loc, mode: 'insensitive' } },
          { state: { contains: loc, mode: 'insensitive' } },
        ])
      });
    }
  }

  if (minFees !== undefined || maxFees !== undefined) {
    where.fees = {};
    if (minFees !== undefined) where.fees.gte = minFees;
    if (maxFees !== undefined) where.fees.lte = maxFees;
  }

  if (ownership) {
    const owns = ownership.split(',').map(o => o.trim()).filter(Boolean);
    if (owns.length > 0) {
      (where.AND as Prisma.CollegeWhereInput[]).push({
        OR: owns.map(own => ({ ownership: { contains: own, mode: 'insensitive' } }))
      });
    }
  }
  if (minRating !== undefined) where.rating = { gte: minRating };
  
  if (exam) {
    const examLower = exam.toLowerCase();
    // Instead of strict hasSome (most colleges have empty exams[]), 
    // use exam to filter by relevant ownership/stream as a soft match
    const examOrs: Prisma.CollegeWhereInput[] = [];
    
    if (examLower.includes('jee') || examLower.includes('bitsat') || examLower.includes('gate') ||
        examLower.includes('mht') || examLower.includes('wbjee')) {
      // Engineering exams — match engineering colleges
      examOrs.push(
        { name: { contains: 'Engineering', mode: 'insensitive' } },
        { name: { contains: 'Technology', mode: 'insensitive' } },
        { name: { contains: 'Institute of Technology', mode: 'insensitive' } },
        { degrees: { hasSome: ['B.Tech', 'B.E', 'Engineering', 'Technology'] } },
        { exams: { hasSome: ['JEE Main', 'JEE', 'JEE Main 2025', 'JEE Advanced', 'BITSAT', 'GATE', 'MHT-CET', 'WBJEE'] } },
      );
    } else if (examLower.includes('neet') || examLower.includes('aiapget')) {
      // Medical exams
      examOrs.push(
        { name: { contains: 'Medical', mode: 'insensitive' } },
        { name: { contains: 'AIIMS', mode: 'insensitive' } },
        { name: { contains: 'Health', mode: 'insensitive' } },
        { degrees: { hasSome: ['MBBS', 'BDS', 'Medical', 'Pharmacy', 'Nursing'] } },
        { exams: { hasSome: ['NEET', 'NEET UG', 'NEET 2025'] } },
      );
    } else if (examLower.includes('cat') || examLower.includes('xat') || examLower.includes('snap')) {
      // Management exams
      examOrs.push(
        { name: { contains: 'Management', mode: 'insensitive' } },
        { name: { contains: 'Business', mode: 'insensitive' } },
        { name: { contains: 'IIM', mode: 'insensitive' } },
        { degrees: { hasSome: ['MBA', 'PGDM', 'BBA', 'Management'] } },
        { exams: { hasSome: ['CAT', 'XAT', 'SNAP', 'MAT'] } },
      );
    } else if (examLower.includes('clat')) {
      // Law exams
      examOrs.push(
        { name: { contains: 'Law', mode: 'insensitive' } },
        { name: { contains: 'Legal', mode: 'insensitive' } },
        { degrees: { hasSome: ['LLB', 'LLM', 'Law'] } },
        { exams: { hasSome: ['CLAT', 'AILET'] } },
      );
    }
    
    if (examOrs.length > 0) {
      (where.AND as Prisma.CollegeWhereInput[]).push({ OR: examOrs });
    }
    // If no match (unknown exam), skip exam filter — return all colleges by rank
  }

  // Improved Rank-based filtering heuristic
  if (rank !== undefined && rank > 0) {
    if (rank <= 500) {
      where.rating = { gte: 4.5 };
    } else if (rank <= 2000) {
      where.rating = { gte: 4.0 };
    } else if (rank <= 10000) {
      where.rating = { gte: 3.5 };
    } else if (rank <= 50000) {
      where.rating = { gte: 3.0 };
    } else if (rank <= 200000) {
      where.rating = { gte: 2.5 };
    } else {
      // Very high rank — show all colleges (no rating filter)
      delete where.rating;
    }
  }

  if (course) {
    const courses = course.split(',').map(c => c.trim()).filter(Boolean);
    if (courses.length > 0) {
      const courseOrs: Prisma.CollegeWhereInput[] = [];
      courses.forEach(c => {
        let courseKeywords = [c];
        if (c.toLowerCase() === 'engineering') courseKeywords.push('b.tech', 'm.tech', 'technology');
        if (c.toLowerCase() === 'medical') courseKeywords.push('mbbs', 'bds', 'nursing', 'health');
        if (c.toLowerCase() === 'management') courseKeywords.push('mba', 'bba', 'business', 'pgdm');
        if (c.toLowerCase() === 'law') courseKeywords.push('llb', 'llm', 'legal');

        courseKeywords.forEach(kw => {
          courseOrs.push({ degrees: { hasSome: [kw] } });
          courseOrs.push({ name: { contains: kw, mode: 'insensitive' } });
        });
      });
      (where.AND as Prisma.CollegeWhereInput[]).push({ OR: courseOrs });
    }
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
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  });
  return states.map(s => s.state);
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
