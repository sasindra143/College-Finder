import { Request, Response, NextFunction } from "express";
import * as collegeService from "../services/college.service";

/**
 * Helper: safely parse number
 */
const toNumber = (val: any, defaultVal?: number): number | undefined => {
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
};

/**
 * Helper: safely normalize params to string
 */
const toStringParam = (val: string | string[] | undefined): string | null => {
  if (!val) return null;
  return Array.isArray(val) ? val[0] : val;
};

/**
 * List colleges with filters + pagination
 */
export const listColleges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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
      page,
      limit,
      sortBy,
      sortOrder,
    } = req.query;

    const result = await collegeService.getColleges({
      search: search?.toString(),
      location: location?.toString(),
      minFees: toNumber(minFees),
      maxFees: toNumber(maxFees),
      ownership: ownership?.toString(),
      minRating: toNumber(minRating),
      course: course?.toString(),
      exam: exam?.toString(),
      rank: toNumber(rank),

      page: toNumber(page, 1) || 1,
      limit: Math.min(toNumber(limit, 12) || 12, 50),

      sortBy: sortBy?.toString() || "rating",
      sortOrder: sortOrder === "asc" ? "asc" : "desc",
    });

    // ─ Cache list results: 60s fresh, 300s stale-while-revalidate ─────────
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({
      success: true,
      data: result.colleges,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single college by ID or slug
 */
export const getCollege = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = toStringParam(req.params.id);

    if (!id) {
      res.status(400).json({
        success: false,
        message: "College ID is required",
      });
      return;
    }

    // ─ Single-pass: try slug first (URLs always use slug), fall back to ID ─
    const college =
      (await collegeService.getCollegeBySlug(id)) ||
      (await collegeService.getCollegeById(id));

    if (!college) {
      res.status(404).json({ success: false, message: 'College not found' });
      return;
    }

    // ─ Cache individual college for 5 minutes ───────────────────────────
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    res.json({ success: true, data: college });
  } catch (err) {
    next(err);
  }
};

/**
 * Compare 2–3 colleges
 */
export const compareColleges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { ids } = req.query;

    if (!ids || typeof ids !== "string") {
      res.status(400).json({
        success: false,
        message: "Please provide college IDs",
      });
      return;
    }

    const idArray = ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (idArray.length < 2 || idArray.length > 3) {
      res.status(400).json({
        success: false,
        message: "Provide 2–3 college IDs to compare",
      });
      return;
    }

    const colleges = await collegeService.getCollegesForComparison(idArray);

    res.json({
      success: true,
      data: colleges,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all unique locations
 */
export const getLocations = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locations = await collegeService.getUniqueLocations();

    res.json({
      success: true,
      data: locations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Bulk import colleges
 */
export const bulkImport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { colleges } = req.body;

    if (!Array.isArray(colleges)) {
      res.status(400).json({
        success: false,
        message: "Data must be an array of colleges",
      });
      return;
    }

    if (colleges.length === 0) {
      res.status(400).json({
        success: false,
        message: "Empty data provided",
      });
      return;
    }

    const count = await collegeService.bulkCreateColleges(colleges);

    res.json({
      success: true,
      message: `Successfully imported ${count} colleges`,
    });
  } catch (err) {
    next(err);
  }
};