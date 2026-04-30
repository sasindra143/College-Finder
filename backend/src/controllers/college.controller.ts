import { Request, Response, NextFunction } from 'express';
import * as collegeService from '../services/college.service';

export const listColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search, location, minFees, maxFees, ownership, minRating, course,
      page, limit, sortBy, sortOrder,
    } = req.query;

    const result = await collegeService.getColleges({
      search: search as string,
      location: location as string,
      minFees: minFees ? Number(minFees) : undefined,
      maxFees: maxFees ? Number(maxFees) : undefined,
      ownership: ownership as string,
      minRating: minRating ? Number(minRating) : undefined,
      course: course as string,
      page: page ? Number(page) : 1,
      limit: limit ? Math.min(Number(limit), 50) : 12,
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
    });

    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

export const getCollege = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    let college = await collegeService.getCollegeById(id as string);
    
    if (!college) {
      college = await collegeService.getCollegeBySlug(id as string);
    }

    if (!college) {
      res.status(404).json({ success: false, message: 'College not found' });
      return;
    }
    res.json({ success: true, data: college });
  } catch (err) {
    next(err);
  }
};

export const compareColleges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { ids } = req.query;
    if (!ids) {
      res.status(400).json({ success: false, message: 'Please provide college IDs' });
      return;
    }

    const idArray = (ids as string).split(',').map(id => id.trim()).filter(Boolean);
    if (idArray.length < 2 || idArray.length > 3) {
      res.status(400).json({ success: false, message: 'Provide 2-3 college IDs to compare' });
      return;
    }

    const colleges = await collegeService.getCollegesForComparison(idArray);
    res.json({ success: true, data: colleges });
  } catch (err) {
    next(err);
  }
};

export const getLocations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await collegeService.getUniqueLocations();
    res.json({ success: true, data: locations });
  } catch (err) {
    next(err);
  }
};

export const bulkImport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { colleges } = req.body;
    if (!Array.isArray(colleges)) {
      res.status(400).json({ success: false, message: 'Data must be an array of colleges' });
      return;
    }

    const count = await collegeService.bulkCreateColleges(colleges);
    res.json({ success: true, message: `Successfully imported ${count} colleges` });
  } catch (err) {
    next(err);
  }
};
