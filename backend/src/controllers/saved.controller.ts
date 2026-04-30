import { Response, NextFunction } from 'express';
import * as savedService from '../services/saved.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const saveCollege = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { collegeId } = req.body;
    const saved = await savedService.saveCollege(req.userId!, collegeId);
    res.status(201).json({ success: true, message: 'College saved', data: saved });
  } catch (err) { next(err); }
};

export const unsaveCollege = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { collegeId } = req.params;
    await savedService.unsaveCollege(req.userId!, collegeId as string);
    res.json({ success: true, message: 'College removed from saved list' });
  } catch (err) { next(err); }
};

export const getSavedColleges = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const saved = await savedService.getSavedColleges(req.userId!);
    res.json({ success: true, data: saved });
  } catch (err) { next(err); }
};

export const saveComparison = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, collegeIds } = req.body;
    const comparison = await savedService.saveComparison(req.userId!, name, collegeIds);
    res.status(201).json({ success: true, message: 'Comparison saved', data: comparison });
  } catch (err) { next(err); }
};

export const getSavedComparisons = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comparisons = await savedService.getSavedComparisons(req.userId!);
    res.json({ success: true, data: comparisons });
  } catch (err) { next(err); }
};

export const deleteComparison = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    await savedService.deleteSavedComparison(req.userId!, id as string);
    res.json({ success: true, message: 'Comparison deleted' });
  } catch (err) { next(err); }
};
