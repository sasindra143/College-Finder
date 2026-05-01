import { Request, Response, NextFunction } from "express";
import * as savedService from "../services/saved.service";

/**
 * Helper: safely convert req.params value to string
 */
const toStringParam = (val: string | string[] | undefined): string | null => {
  if (!val) return null;
  return Array.isArray(val) ? val[0] : val;
};

/**
 * Save a college
 */
export const saveCollege = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { collegeId } = req.body;
    const userId = req.userId;

    if (!userId || !collegeId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const saved = await savedService.saveCollege(userId, collegeId);

    res.status(201).json({
      success: true,
      message: "College saved",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Remove saved college
 */
export const unsaveCollege = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const collegeId = toStringParam(req.params.collegeId);

    if (!userId || !collegeId) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    await savedService.unsaveCollege(userId, collegeId);

    res.json({
      success: true,
      message: "College removed from saved list",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get saved colleges
 */
export const getSavedColleges = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const saved = await savedService.getSavedColleges(userId);

    res.json({
      success: true,
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Save comparison
 */
export const saveComparison = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, collegeIds } = req.body;
    const userId = req.userId;

    if (!userId || !name || !collegeIds) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    const comparison = await savedService.saveComparison(
      userId,
      name,
      collegeIds
    );

    res.status(201).json({
      success: true,
      message: "Comparison saved",
      data: comparison,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get saved comparisons
 */
export const getSavedComparisons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const comparisons = await savedService.getSavedComparisons(userId);

    res.json({
      success: true,
      data: comparisons,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete comparison
 */
export const deleteComparison = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;
    const id = toStringParam(req.params.id);

    if (!userId || !id) {
      res.status(400).json({ message: "Invalid request" });
      return;
    }

    await savedService.deleteSavedComparison(userId, id);

    res.json({
      success: true,
      message: "Comparison deleted",
    });
  } catch (err) {
    next(err);
  }
};