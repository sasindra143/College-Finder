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

// Map exam name → stream keywords for soft matching
function getExamStreamKeywords(examLower: string): {
  nameKeywords: string[];
  degreeKeywords: string[];
  examKeywords: string[];
} {
  if (examLower.includes('jee') || examLower.includes('bitsat') ||
      examLower.includes('mht') || examLower.includes('wbjee') ||
      examLower.includes('comedk')) {
    return {
      nameKeywords: ['Engineering', 'Technology', 'Technical', 'Polytechnic'],
      degreeKeywords: ['B.Tech', 'B.E.', 'M.Tech'],
      examKeywords: ['JEE Main', 'JEE Advanced', 'GATE', 'BITSAT', 'COMEDK', 'WBJEE'],
    };
  }
  if (examLower.includes('gate')) {
    return {
      nameKeywords: ['Engineering', 'Technology', 'IIT', 'NIT'],
      degreeKeywords: ['M.Tech', 'B.Tech', 'B.E.'],
      examKeywords: ['GATE', 'JEE Main'],
    };
  }
  if (examLower.includes('neet') || examLower.includes('aiims')) {
    return {
      nameKeywords: ['Medical', 'Medicine', 'Health', 'AIIMS', 'Hospital', 'Nursing'],
      degreeKeywords: ['MBBS', 'BDS', 'B.Sc Nursing', 'BHMS', 'BAMS'],
      examKeywords: ['NEET', 'NEET UG', 'NEET PG', 'AIIMS'],
    };
  }
  if (examLower.includes('cat') || examLower.includes('xat') ||
      examLower.includes('mat') || examLower.includes('cmat')) {
    return {
      nameKeywords: ['Management', 'Business', 'IIM', 'Commerce'],
      degreeKeywords: ['MBA', 'BBA', 'PGDM', 'MMS'],
      examKeywords: ['CAT', 'XAT', 'MAT', 'CMAT', 'SNAP'],
    };
  }
  if (examLower.includes('clat') || examLower.includes('ailet') || examLower.includes('lsat')) {
    return {
      nameKeywords: ['Law', 'Legal', 'NLU'],
      degreeKeywords: ['LLB', 'BA LLB', 'LLM'],
      examKeywords: ['CLAT', 'AILET', 'LSAT India'],
    };
  }
  if (examLower.includes('cuet') || examLower.includes('du') || examLower.includes('state')) {
    return {
      nameKeywords: ['College', 'University', 'Arts', 'Science', 'Commerce'],
      degreeKeywords: ['B.A', 'B.Sc', 'B.Com', 'M.A'],
      examKeywords: ['CUET', 'State CET'],
    };
  }
  // Unknown exam — return empty (will trigger fallback)
  return { nameKeywords: [], degreeKeywords: [], examKeywords: [] };
}

// Rank → Rating Bracket [min, max]
function rankToRatingRange(rank: number): { min: number; max: number } {
  if (rank <= 500) return { min: 4.6, max: 5.0 };
  if (rank <= 2000) return { min: 4.3, max: 4.7 };
  if (rank <= 10000) return { min: 3.9, max: 4.4 };
  if (rank <= 30000) return { min: 3.5, max: 4.0 };
  if (rank <= 60000) return { min: 3.1, max: 3.6 };
  if (rank <= 120000) return { min: 2.7, max: 3.2 };
  return { min: 0.0, max: 2.8 };
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

  const validSortFields = ['rating', 'fees', 'nirfRank', 'name', 'established', 'placementPercent'];
  const orderField = validSortFields.includes(sortBy) ? sortBy : 'rating';
  const skip = (page - 1) * limit;

  const selectFields = {
    id: true, name: true, slug: true, location: true,
    city: true, state: true, ownership: true, fees: true,
    rating: true, totalReviews: true, placementPercent: true,
    avgPackage: true, imageUrl: true, nirfRank: true,
    accreditation: true, naacGrade: true, established: true,
    exams: true, degrees: true, website: true, affiliation: true,
    _count: { select: { courses: true } },
  };

  // ─── PREDICTOR MODE: exam + rank present ───────────────────────────────────
  if (exam && rank !== undefined && rank > 0) {
    const examLower = exam.toLowerCase();
    const { nameKeywords, degreeKeywords, examKeywords } = getExamStreamKeywords(examLower);
    const { min, max } = rankToRatingRange(rank);

    // Phase 1: strict exam-stream filtered query
    if (nameKeywords.length > 0) {
      const examWhere: Prisma.CollegeWhereInput = {
        AND: [
          {
            OR: [
              ...nameKeywords.map(k => ({ name: { contains: k, mode: 'insensitive' as const } })),
              ...degreeKeywords.map(k => ({ degrees: { hasSome: [k] } })),
              ...examKeywords.map(k => ({ exams: { hasSome: [k] } })),
            ]
          },
          { rating: { gte: min, lte: max } },
        ]
      };

      // Calculate a rank-based offset to ensure different ranks show different results
      // even within the same rating bracket.
      const totalInBracket = await prisma.college.count({ where: examWhere });
      const rankOffset = (rank * 7) % Math.max(1, totalInBracket - limit);

      const colleges = await prisma.college.findMany({
        where: examWhere,
        skip: rankOffset,
        take: limit,
        orderBy: [
          { rating: rank % 2 === 0 ? 'desc' : 'asc' }, // Alternate sort to increase variety
          { name: rank % 3 === 0 ? 'asc' : 'desc' },
        ],
        select: selectFields,
      });

      if (colleges.length >= 5) {
        return buildResponse(colleges, totalInBracket, page, limit);
      }
    }

    // Phase 2 fallback
    const fallbackWhere: Prisma.CollegeWhereInput = { rating: { gte: min, lte: max } };
    const totalFallback = await prisma.college.count({ where: fallbackWhere });
    const fallbackOffset = (rank * 13) % Math.max(1, totalFallback - limit);

    const colleges = await prisma.college.findMany({
      where: fallbackWhere,
      skip: fallbackOffset,
      take: limit,
      orderBy: [{ rating: 'desc' }, { id: 'asc' }],
      select: selectFields,
    });

    return buildResponse(colleges, totalFallback, page, limit);
  }

  // ─── NORMAL DISCOVERY MODE ─────────────────────────────────────────────────
  const where: Prisma.CollegeWhereInput = { AND: [] };

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
    const { nameKeywords, degreeKeywords, examKeywords } = getExamStreamKeywords(exam.toLowerCase());
    if (nameKeywords.length > 0) {
      (where.AND as Prisma.CollegeWhereInput[]).push({
        OR: [
          ...nameKeywords.map(k => ({ name: { contains: k, mode: 'insensitive' as const } })),
          ...degreeKeywords.map(k => ({ degrees: { hasSome: [k] } })),
          ...examKeywords.map(k => ({ exams: { hasSome: [k] } })),
        ]
      });
    }
  }

  if (course) {
    const courses = course.split(',').map(c => c.trim()).filter(Boolean);
    if (courses.length > 0) {
      const courseOrs: Prisma.CollegeWhereInput[] = [];
      courses.forEach(c => {
        const kws = [c];
        if (c.toLowerCase() === 'engineering') kws.push('technology', 'b.tech');
        if (c.toLowerCase() === 'medical') kws.push('mbbs', 'nursing', 'health');
        if (c.toLowerCase() === 'management') kws.push('mba', 'bba', 'business');
        if (c.toLowerCase() === 'law') kws.push('llb', 'llm');
        kws.forEach(kw => {
          courseOrs.push({ degrees: { hasSome: [kw] } });
          courseOrs.push({ name: { contains: kw, mode: 'insensitive' } });
        });
      });
      (where.AND as Prisma.CollegeWhereInput[]).push({ OR: courseOrs });
    }
  }

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where, skip, take: limit,
      orderBy: [{ [orderField]: sortOrder }, { id: 'asc' }],
      select: selectFields,
    }),
    prisma.college.count({ where }),
  ]);

  return buildResponse(colleges, total, page, limit);
};

function buildResponse(colleges: any[], total: number, page: number, limit: number) {
  return {
    colleges,
    data: colleges,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

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
        }
      });
      count++;
    } catch (e) {
      console.error('Import error for:', c.name, e);
    }
  }
  return count;
};
